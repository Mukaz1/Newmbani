import { Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { RolesService } from '../../auth/services/roles.service';
import { UsersService } from '../../auth/services/users.service';
import {
  CreateLandlordDto,
  PostLandlordDto,
  UpdateLandlordDto,
} from '../dtos/lanlords.dto';
import { CustomHttpResponse } from '../../common';
import {
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  Landlord,
  PaginatedData,
  SystemEventsEnum,
  User,
} from '@newmbani/types';
import { LandlordModel } from '../schemas/landlord.schema';
import { LandlordAggregation } from '../queries/landlord.query';
import { getLandlordParams } from '../utils/getLandlordParams';
import { LandlordApprovalStatus } from '@newmbani/types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LandlordsService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {
    //
  }

  async createLandlord(landlordDto: CreateLandlordDto) {
    try {
      const {
        displayName,
        name,
        email,
        phone,
        address,
        acceptTerms,
        languages,
      } = landlordDto;

      if (acceptTerms !== true) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'You must accept the terms and conditions to proceed.',
          data: null,
        });
      }

      const existingLandlord = await LandlordModel.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingLandlord) {
        if (existingLandlord.email === email) {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: 'The email you have provided already exists',
            data: null,
          });
        }
        if (existingLandlord.phone === phone) {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: 'The phone number you have provided already exists',
            data: null,
          });
        }
      }
      const landlordData: PostLandlordDto = {
        displayName,
        name,
        email,
        phone,
        address,
        languages,
        acceptTerms,
        approvalStatus: LandlordApprovalStatus.UNDER_REVIEW,
        createdBy: 'system',
      };

      // Create landlord
      const landlord: Landlord = await LandlordModel.create(landlordData);
      // get role id
      // const roleId: string = (
      //   await this.rolesService.getLandlordRole()
      // )._id.toString();

      // Prepare user account for employee
      //   const userData: PostUserDto = {
      //     landlordId: landlord._id.toString(),
      //     name,
      //     email,
      //     password,
      //     phone,
      //     createdBy: 'system',
      //     roleId,
      //   };

      //   const user: User = (await this.usersService.create(userData))
      //     .data as User;

      // Emit events
      this.eventEmitter.emit(SystemEventsEnum.LandlordCreated, landlord);
      //   this.eventEmitter.emit(SystemEventsEnum.UserCreated, user);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Landlord account ${landlord.name} created successfully!`,
        data: landlord,
      });
    } catch (error) {
      console.log(error);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an issue creating landlord account ${landlordDto.name}!`,
        data: error,
      });
    }
  }

  async getAllLandlords(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const totalDocuments = await LandlordModel.countDocuments().exec();
      const _query = await getLandlordParams({ query, totalDocuments });
      const { limit, page } = _query;
      const aggregation = LandlordAggregation({ payload: _query });
      const data = await LandlordModel.aggregate<Landlord>(aggregation).exec();

      const counts = await LandlordModel.aggregate([
        ...aggregation.slice(0, -2),
        { $count: 'count' },
      ]).exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData<Landlord[]> = {
        page,
        limit,
        total,
        data,
        pages,
      };
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Landlord list loaded successfully!',
        data: response,
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
   * Get landlord by ID
   *
   * @param {string} id - The ID of the landlord to retrieve
   * @returns {Promise<HttpResponseInterface>} A promise resolving to the HTTP response containing the landlord data
   */
  async getLandlordById(
    landlordId: string,
  ): Promise<HttpResponseInterface<Landlord>> {
    try {
      const _query = await getLandlordParams({
        query: {} as ExpressQuery,
        totalDocuments: 1,
      });
      const aggregation = LandlordAggregation({ payload: _query, landlordId });
      const landlords =
        await LandlordModel.aggregate<Landlord>(aggregation).exec();
      if (!landlords.length) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message:
            'There is no landlord with the id you have provided. Try again!',
          data: null,
        });
      }
      const landlord = landlords[0];
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Landlord loaded successfully!',
        data: landlord,
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
   * Update landlord
   *
   * @param {string} id
   * @param {UpdateLandlordDto} data
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof LandlordsService
   */
  async updateLandlord(
    id: string,
    data: UpdateLandlordDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: any = data as unknown as any;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      // Remove the fields to be updated
      const { _id, createdBy, createdAt, __v, ...update } = payload;
      // update the landlord group
      const landlord = await LandlordModel.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });

      // Emit the event that the landlord has been updated
      this.eventEmitter.emit(SystemEventsEnum.LandlordUpdated, landlord);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Landlord updated successfully!',
        data: landlord,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }
}
