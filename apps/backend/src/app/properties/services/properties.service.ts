import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  ExpressQuery,
  Property,
  PaginatedData,
  SystemEventsEnum,
  PropertyApprovalStatus,
  LandlordApprovalStatus,
} from '@newmbani/types';
import { PipelineStage } from 'mongoose';
import { CustomHttpResponse, generateSlug, getSlugAndId } from '../../common';
import {
  CreatePropertyDto,
  PostCreatePropertyDto,
  PostUpdatePropertyDto,
  UpdatePropertyDto,
} from '../dtos/properties.dto';
import { AggregateProperties } from '../queries/properties.query';
import { PropertyModel } from '../schemas/properties.schema';
import { getPropertyQueryParams } from '../utils/getPropertiesParams';
import { LandlordModel } from '../../landlords/schemas/landlord.schema';

@Injectable()
export class PropertiesService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Register a new Property
   */
  async create(data: {
    propertyDto: CreatePropertyDto;
    userId: string;
  }): Promise<HttpResponseInterface> {
    const { propertyDto, userId } = data;
    const landlordId = propertyDto.landlordId;
    try {
      let foundLandlord: any = null;

      // If landlordId is provided, check if landlord exists first, then check if they are verified
      if (landlordId) {
        foundLandlord = await LandlordModel.findById(landlordId).exec();

        if (!foundLandlord) {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: `The landlord provided is not found.`,
            data: null,
          });
        }

        if (foundLandlord.approvalStatus !== LandlordApprovalStatus.APPROVED) {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: `The landlord provided is not approved.`,
            data: null,
          });
        }
      }

      // enforce PostCreatePropertyDto from CreatePropertyDto
      const payload: PostCreatePropertyDto = {
        ...propertyDto,
        createdBy: userId,
        approvalStatus: PropertyApprovalStatus.UNDER_REVIEW,
        slug: generateSlug(propertyDto.title),
        landlordId: landlordId ?? propertyDto.landlordId,
      };

      // store property
      const property = await PropertyModel.create(payload);

      // emit event
      this.eventEmitter.emit(SystemEventsEnum.PropertyCreated, property);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `The property ${propertyDto.title} has been created successfully`,
        data: (await this.findOne(property._id.toString())).data,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error creating the property ${propertyDto.title}`,
        data: error,
      });
    }
  }

  /**
   * Find all properties
   */
  async findAll(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const totalDocuments = await PropertyModel.find().countDocuments().exec();
      const queryProps: any = await getPropertyQueryParams(
        query,
        totalDocuments,
      );

      const { page, limit } = queryProps;

      const search = await AggregateProperties(queryProps);

      const categories: Property[] = await PropertyModel.aggregate(
        search as PipelineStage[],
      ).exec();

      const countsPipeline: PipelineStage[] = [
        ...(search.filter(Boolean) as PipelineStage[]),
        { $count: 'count' },
      ];

      const counts = await PropertyModel.aggregate(countsPipeline).exec();
      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Properties loaded from database successfully!',
        data: { page, limit, total, data: categories, pages } as PaginatedData,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an issue loading properties from database',
        data: error,
      });
    }
  }

  /**
   * Find one property by ID or slug
   */
  async findOne(id: string): Promise<HttpResponseInterface<Property>> {
    const q = getSlugAndId(id);
    const propertyId: string | undefined = q.id;
    const slug: string | undefined = q.slug;

    try {
      const queryProps = await getPropertyQueryParams(
        {
          propertyId,
          slug,
        },
        1,
      );
      const query = await AggregateProperties(queryProps);

      const propertiesQuery: Property[] = await PropertyModel.aggregate(
        query as any[],
      ).exec();
      const property: Property | undefined = propertiesQuery[0];

      if (property) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.OK,
          message: `The property with id ${propertyId ?? slug} found`,
          data: property,
        });
      } else {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `The property with id ${propertyId ?? slug} not found`,
          data: null,
        });
      }
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error getting the property with the id ${
          propertyId ?? slug
        }`,
        data: error,
      });
    }
  }

  /**
   * Update Property
   */
  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };

      const payload: PostUpdatePropertyDto = {
        ...updatePropertyDto,
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const property = await PropertyModel.findOneAndUpdate(filter, payload, {
        new: true,
      });

      this.eventEmitter.emit(SystemEventsEnum.PropertyUpdated, property);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property ${updatePropertyDto.title} updated successfully!`,
        data: property,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Remove property
   */
  async remove(id: string): Promise<HttpResponseInterface> {
    try {
      await PropertyModel.deleteOne({ _id: id }).exec();

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property ${id} removed successfully!`,
        data: null,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Error removing property ${id}`,
        data: error,
      });
    }
  }
}
