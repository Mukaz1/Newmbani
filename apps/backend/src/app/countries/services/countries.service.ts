import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  Country,
  DatabaseModelEnums,
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
  UpdateCountry,
} from '@newmbani/types';
import { CustomHttpResponse } from '../../common';
import { getCountriesParams } from '../queries/getCountryParams';
import {
  CountriesQuery,
  CountryAggregationPayload,
} from '../queries/countries.query';
import { UpdateCountryDto } from '../dto/country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(DatabaseModelEnums.COUNTRY)
    private countries: Model<Country>
  ) {
    //
  }

  async getAllCountries(
    query: ExpressQuery
  ): Promise<HttpResponseInterface<PaginatedData<Country[] | null>>> {
    try {
      const totalDocuments: number = await this.countries
        .find()
        .countDocuments()
        .exec();
      // clean up query props
      const queryProps: CountryAggregationPayload = await getCountriesParams({
        query,
        totalDocuments,
      });

      const { page, limit } = queryProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggregation: Array<any> = await CountriesQuery(queryProps);

      // Ensure sorting by name in alphabetical order (ascending)
      aggregation.push({ $sort: { name: 1 } });

      const data: Country[] = await this.countries
        .aggregate(aggregation)
        .exec();
      const counts = await this.countries
        .aggregate([...aggregation.slice(0, -2), { $count: 'count' }])
        .exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData<Country[]> = {
        page,
        limit,
        total,
        data,
        pages,
      };
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Countries retrieved successfully',
        data: response,
      });
    } catch (error) {
      console.error(error);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an issue retrieving your Countries. Try again',
        data: error,
      });
    }
  }

  async findOne(id: string): Promise<HttpResponseInterface<Country | null>> {
    try {
      const country = await this.countries.findById(id).exec();
      if (country) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.OK,
          message: `The country with id ${id} found`,
          data: country,
        });
      } else {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `The country with id ${id} not found`,
          data: null,
        });
      }
    } catch (error) {
      console.error('Error finding country:', error);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error getting the country with the id ${id}`,
        data: null,
      });
    }
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
    userId: string
  ): Promise<HttpResponseInterface<Country | null>> {
    try {
      // Check if country exists
      const existingCountry = await this.countries.findById(id).exec();
      if (!existingCountry) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Country with id ${id} not found`,
          data: null,
        });
      }

      // Prepare update payload, handling nested objects to match expected types
      const updatePayload: Partial<UpdateCountry> = {
        ...updateCountryDto,
        // Only spread nested objects if they exist to avoid type errors
        commissionRates: updateCountryDto.commissionRates
          ? {
              ...existingCountry.commissionRates,
              ...updateCountryDto.commissionRates,
              service: updateCountryDto.commissionRates.service
                ? {
                    ...existingCountry.commissionRates?.service,
                    ...updateCountryDto.commissionRates.service,
                  }
                : existingCountry.commissionRates?.service,
              property: updateCountryDto.commissionRates.property
                ? {
                    ...existingCountry.commissionRates?.property,
                    ...updateCountryDto.commissionRates.property,
                  }
                : existingCountry.commissionRates?.property,
            }
          : undefined,
        supporting: updateCountryDto.supporting
          ? {
              ...existingCountry.supporting,
              ...updateCountryDto.supporting,
            }
          : undefined,
      };
      if (updateCountryDto.commissionRates) {
        updatePayload.commissionRates = {
          ...existingCountry.commissionRates,
          ...updateCountryDto.commissionRates,
        };

        // Handle individual commission rate updates
        if (updateCountryDto.commissionRates.service) {
          updatePayload.commissionRates.service = {
            ...existingCountry.commissionRates.service,
            ...updateCountryDto.commissionRates.service,
          };
        }

        if (updateCountryDto.commissionRates.property) {
          updatePayload.commissionRates.property = {
            ...existingCountry.commissionRates.property,
            ...updateCountryDto.commissionRates.property,
          };
        }
      }

      if (updateCountryDto.supporting) {
        updatePayload.supporting = {
          ...existingCountry.supporting,
          ...updateCountryDto.supporting,
        };
      }

      // Update the country
      let updatedCountry = await this.countries
        .findByIdAndUpdate(
          id,
          { ...updatePayload },
          {
            returnOriginal: false,
          }
        )
        .exec();
      const landlord = updatedCountry.supporting.landlord ?? false;
      const tenant = updatedCountry.supporting.tenant ?? false;
      // recalc supported
      const supported = landlord || tenant;
      // update the data
      updatedCountry = await this.countries
        .findByIdAndUpdate(
          id,
          { supported, updatedBy: userId, updatedAt: new Date() },
          {
            returnOriginal: false,
          }
        )
        .exec();
      if (!updatedCountry) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'Failed to update country',
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Country updated successfully!',
        data: updatedCountry,
      });
    } catch (error) {
      console.error('Error updating country:', error);

      // Handle validation errors
      if (error.name === 'ValidationError') {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'Validation failed: ' + error.message,
          data: null,
        });
      }

      // Handle cast errors (invalid ObjectId)
      if (error.name === 'CastError') {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: `Invalid country ID: ${id}`,
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        message: 'Internal server error while updating country',
        data: null,
      });
    }
  }
}
