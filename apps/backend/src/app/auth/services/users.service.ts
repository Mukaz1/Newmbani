import { Global, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { SettingsService } from '../../settings/services/settings.service';
import {
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
  SystemEventsEnum,
  User,
} from '@newmbani/types';

import { CustomHttpResponse } from '../../common';
import { hashPassword } from '../../common/helpers';
import {
  getUserQueryParams,
  UserQueryData,
} from '../utils/getUsersQueryParams';
import { UserAggregation } from '../queries/users.query';
import { RegisterUserDto, SaveUserDto } from '../dto/users/register-user.dto';
import {
  ManageMagicLoginDto,
  PostMagicLoginStatusDto,
} from '../dto/users/update-magic-login.dto';
import {
  DefaultAddressDto,
  PostDefaultAddressStatusDto,
} from '../dto/users/update-shipping-address.dto';
import { UserModel } from '../schemas/user.schema';

@Global()
@Injectable()
export class UsersService {
  constructor(
    private readonly settings: SettingsService,
    private eventEmitter: EventEmitter2,
  ) {
    //
  }

  /**
   * Get all users-old from the database
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof UsersService
   */
  async findAll(
    query?: ExpressQuery,
  ): Promise<HttpResponseInterface<PaginatedData<User[]>>> {
    try {
      const totalDocuments = await UserModel.countDocuments().exec();
      const queryData: UserQueryData = getUserQueryParams({
        query,
        totalDocuments,
      });
      const { limit, page } = queryData;
      const aggregation = UserAggregation(queryData);
      const data = await UserModel.aggregate<User>(aggregation).exec();

      const counts = await UserModel.aggregate([
        ...aggregation.slice(0, -2),
        { $count: 'count' },
      ]).exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData<User[]> = {
        page,
        limit,
        total,
        data,
        pages,
      };
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Users loaded successfully!',
        data: response,
      });
    } catch (error) {
      console.log(error);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    }
  }

  /**
   * Create a user account
   * @returns Promise<HttpResponseInterface>
   * @param userDto
   */
  async create(
    userDto: RegisterUserDto,
  ): Promise<HttpResponseInterface<User | null>> {
    try {
      const {
        password,
        email,
        name,
        phone,
        customerId,
        landlordId,
        employeeId,
        roleId,
      } = userDto;
      let user: User | null = await this.checkEmailAndPhoneUnique({
        email,
        phone,
      });

      // confirm Email
      if (user && user.email === email) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The email you have provided already exists',
          data: null,
        });
      }

      // confirm phone
      if (user && user.phone === phone) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The phone number you have provided already exists',
          data: null,
        });
      }
      const hashedPassword = await hashPassword(password);

      const data: SaveUserDto = {
        password: hashedPassword,
        email: email.toLowerCase(),
        phone: phone,
        name: name,
        customerId,
        employeeId,
        roleId,
        landlordId,
      };

      // create user
      user = await UserModel.create(data);
      // Get settings-wrapper
      const settings = (await this.settings.getSettings({ all: true })).data;
      user.password = password;

      // Emit the event that the user has been created
      this.eventEmitter.emit(SystemEventsEnum.UserAccountCreated, {
        settings,
        user,
      });

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Hey ${user.name}, your user account was created successfully!`,
        data: user,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an error creating the user account',
        data: error,
      });
    }
  }
  async createLandlord(requestData: {
    userId: string;
    landlordId: string;
  }): Promise<HttpResponseInterface<User>> {
    try {
      const { userId, landlordId } = requestData;

      const data: User = await UserModel.findByIdAndUpdate(
        userId,
        { landlordId },
        { returnOriginal: false },
      ).exec();

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Hey ${data.name}, your landlord account was created successfully!`,
        data,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an error creating the user account',
        data: error,
      });
    }
  }
  async checkEmailAndPhoneUnique(data: {
    email: string;
    phone: string;
  }): Promise<User | null> {
    try {
      const user: User | null = await UserModel.findOne({
        $or: [data],
      });

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Get a user using their email
   *
   * @param {string} id
   * @return {*}  {Promise<User>}
   * @memberof UsersService
   */
  async findOne(data: {
    userId?: string;
    roleId?: string;
    email?: string;
    phone?: string;
    customerId?: string;
    landlordId?: string;
    includePassword?: boolean;
  }): Promise<HttpResponseInterface<User | null>> {
    try {
      const queryData: UserQueryData = getUserQueryParams({
        query: {
          ...data,
          limit: 1,
          skip: 0,
          page: 1,
        } as unknown as ExpressQuery,
        totalDocuments: 1,
      });
      const aggregation = UserAggregation(queryData);
      const [user] = await UserModel.aggregate<User>(aggregation).exec();

      if (!user) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: 'User not found!',
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'User found!',
        data: user,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      });
    }
  }

  /**
   *
   * Update a user
   * @param {string} id
   * @param data
   * @param userId
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  async update(
    id: string,
    data: Partial<User>,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: new Types.ObjectId(id) };
      const payload: Partial<User> = data as Partial<User>;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      const updateRes = await UserModel.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'User records updated',
        data: updateRes,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    }
  }

  /**
   *
   * Manage Magic Login
   * @param {string} id
   * @param data
   * @param userId
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  async manageMagicLogin(
    id: string,
    data: ManageMagicLoginDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: PostMagicLoginStatusDto = data as PostMagicLoginStatusDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      const user = await UserModel.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Magic Login ${
          data.magicLogin ? 'enabled' : 'disabled'
        } successfully!`,
        data: user,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    }
  }

  /**
   *
   * Update Default Shipping Address
   * @param {string} id
   * @param data
   * @param userId
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  async updateAddress(
    id: string,
    data: DefaultAddressDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: PostDefaultAddressStatusDto =
        data as PostDefaultAddressStatusDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      const user = await UserModel.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Default Shipping Address updated successfully!`,
        data: user,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    }
  }
}
