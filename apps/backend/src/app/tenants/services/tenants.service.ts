import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  HttpResponseInterface,
  User,
  SystemEventsEnum,
  Tenant,
  ExpressQuery,
  PaginatedData,
} from '@newmbani/types';
import { HttpStatusCodeEnum } from '@newmbani/types';
import { RolesService } from '../../auth/services/roles.service';
import { UsersService } from '../../auth/services/users.service';
import { CustomHttpResponse, generatePassword } from '../../common';
import {
  CreateTenantDto,
  PostTenantDto,
  UpdateTenantDto,
} from '../dtos/tenant.dto';
import { TenantAggregation } from '../queries/tenants.query';
import { TenantModel } from '../schemas/tenant.schema';
import { getTenantQueryParams } from '../utils/getTenantParams';

@Injectable()
export class TenantsService {
  private logger = new Logger(TenantsService.name);

  /**
   * Creates an instance of TenantService.
   * @param {EventEmitter2} eventEmitter
   * @param {UsersService} usersService
   * @memberof TenantService
   */
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {
    //
  }

  /**
   * Create  Tenant Account
   *
   * @param {RegisterTenantDto} tenantDto
   * @param {string} createdBy
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof TenantService
   */
  async createTenant(
    tenantDto: CreateTenantDto,
    createdBy?: string,
  ): Promise<HttpResponseInterface> {
    try {
      const { name, email, phone, acceptTerms } = tenantDto;

      // find all users-old
      //   const users: User[] = (await this.usersService.findAll({ limit: '-1' }))
      //     .data.data;

      //   if (users) {
      // Query DB for existing tenant with the same email
      const emailExist = await TenantModel.findOne({ email }).lean().exec();

      // confirm Email
      if (emailExist) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The email you have provided already exists',
          data: null,
        });
      }

      // confirm phone
      // Query DB for existing tenant with the same phone
      const phoneExist = await TenantModel.findOne({ phone }).lean().exec();

      if (phoneExist) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The phone number you have provided already exists',
          data: null,
        });
      }
      //   }

      if (!acceptTerms) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'You must accept the terms and conditions to register',
          data: null,
        });
      }

      /**
       * Create a new tenant data object with details like name, email,
       * phone etc. to be passed to tenant.create() method.
       *
       * This takes the data from the input tenantDto and formats it
       * into the PostTenantDto type to match the DB model.
       */
      const tenantData: PostTenantDto = {
        name,
        email,
        phone,
        createdBy,
        acceptTerms,
        address: tenantDto.address,
        password: tenantDto.password,
      };

      const tenant = await TenantModel.create(tenantData);

      /**
       * Create a user account for the new tenant if requested.
       *
       * If the email and password, create a user account for the new
       * tenant with their name, email, password etc. and link it to the new
       * tenant document. Call the usersService to create the user in the DB.
       */

      const password: string = tenantDto.password
        ? tenantDto.password
        : generatePassword({ includeSpecialChars: true });
      const tenantId = tenant._id.toString();
      //   const role = await this.rolesService.getTenantRole();
      //   // prepare the user dto
      //   const userData: PostUserDto = {
      //     tenantId,
      //     name: name,
      //     email,
      //     password,
      //     phone,
      //     createdBy,
      //     roleId: role._id.toString(),
      //   };

      // create the user
      //   const user: User = (await this.usersService.create(userData)).data;

      // Emit the event that the tenant has been created
      this.eventEmitter.emit(SystemEventsEnum.TenantCreated, tenant);
      //   this.eventEmitter.emit(SystemEventsEnum.UserCreated, user);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Tenant account ${tenant.name} created successfully!`,
        data: tenant,
      });
    } catch (error) {
      this.logger.error(error);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an issue creating tenant account ${tenantDto.name}!`,
        data: error,
      });
    }
  }

  /**
   * Get a tenant by ID.
   * @returns {Promise<Tenant>} A promise that resolves to the tenant document.
   */
  async findOne(data: {
    id: string | null;
    accountNumber: string | null;
  }): Promise<Tenant | null> {
    const { accountNumber, id } = data;
    if (id) {
      return TenantModel.findOne({ _id: id }).exec();
    }
    if (accountNumber) {
      return TenantModel.findOne({ accountNumber }).exec();
    }
    return null;
  }

  /**
   * Update Tenant details
   *
   * @param {string} id
   * @param {*} payload
   * @return {*}  {Promise<any>}
   * @memberof TenantService
   */
  async update(id: string, payload: Partial<Tenant>): Promise<Tenant> {
    const filter = { _id: id };
    const update = payload;
    const updatedTenant = await TenantModel.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    // Emit the event that the tenant has been created
    this.eventEmitter.emit(SystemEventsEnum.TenantUpdated, updatedTenant);
    return updatedTenant;
  }

  /**
   * Get all Tenants
   *
   * @return {*}  {Promise<HttpResponseInterface>}Poa
   * @memberof TenantService
   */
  async getAllTenants(
    query?: ExpressQuery,
  ): Promise<HttpResponseInterface<PaginatedData<Tenant[]>>> {
    try {
      const totalDocuments = await TenantModel.find().countDocuments().exec();
      const queryData = getTenantQueryParams({ query, totalDocuments });
      const aggregation = TenantAggregation(queryData);
      const { limit, page } = queryData;

      const data = await TenantModel.aggregate<Tenant>(aggregation).exec();

      const counts = await TenantModel.aggregate([
        ...aggregation.slice(0, -2),
        { $count: 'count' },
      ]);

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      const response: PaginatedData<Tenant[]> = {
        page,
        limit,
        total,
        data,
        pages,
      };

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Tenant list loaded successfully!',
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
   * Get tenant by ID
   *
   * @param {string} id - The ID of the tenant to retrieve
   * @returns {Promise<HttpResponseInterface>} A promise resolving to the HTTP response containing the tenant data
   */
  async getTenantById(
    id: string,
  ): Promise<HttpResponseInterface<Tenant | null>> {
    try {
      const queryData = getTenantQueryParams({
        query: {
          tenantId: id,
          limit: 1,
          skip: 0,
          page: 1,
        } as unknown as ExpressQuery,
        totalDocuments: 1,
      });
      const aggregation = TenantAggregation(queryData);

      const [tenant] = await TenantModel.aggregate<Tenant>(aggregation);

      if (!tenant) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message:
            'There is no tenant with the id you have provided. Try again!',
          data: null,
        });
      }
      this.eventEmitter.emit(SystemEventsEnum.TenantUpdated, tenant);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Tenant loaded successfully!',
        data: tenant,
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
   * Update tenant
   *
   * @param {string} id
   * @param {UpdateTenantDto} data
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof TenantService
   */
  async updateTenant(
    id: string,
    data: UpdateTenantDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: Partial<Tenant> = data as unknown as Partial<Tenant>;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      // Remove the fields to be updated
      const { _id, createdBy, createdAt, ...update } = payload;
      // update the tenant group
      const tenant = await TenantModel.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });

      // Emit the event that the tenant has been created
      this.eventEmitter.emit(SystemEventsEnum.TenantUpdated, tenant);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Tenant updated successfully!',
        data: tenant,
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
