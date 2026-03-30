import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  HttpResponseInterface,
  User,
  SystemEventsEnum,
  Customer,
  ExpressQuery,
  PaginatedData,
} from '@newmbani/types';
import { HttpStatusCodeEnum } from '@newmbani/types';
import { RolesService } from '../../auth/services/roles.service';
import { UsersService } from '../../auth/services/users.service';
import { CustomHttpResponse, generatePassword } from '../../common';
import {
  RegisterCustomerDto,
  PostCustomerDto,
  UpdateCustomerDto,
} from '../dtos/customer.dto';
import { CustomerAggregation } from '../queries/customers.query';
import { CustomerModel } from '../schemas/customer.schema';
import { UserModel } from '../../auth/schemas/user.schema';
import { PostUserDto } from '../../auth/dto/users/register-user.dto';
import { getCustomerQueryParams } from '../utils/getCustomerParams';

@Injectable()
export class CustomersService {
  private logger = new Logger(CustomersService.name);

  /**
   * Creates an instance of CustomerService.
   * @param {EventEmitter2} eventEmitter
   * @param {UsersService} usersService
   * @memberof CustomerService
   */
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {
    //
  }

  /**
   * Create  Customer Account
   *
   * @param {RegisterCustomerDto} customerDto
   * @param {string} createdBy
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof CustomerService
   */
  async createCustomer(
    customerDto: RegisterCustomerDto,
  ): Promise<HttpResponseInterface> {
    try {
      const { name, email, phone, acceptTerms } = customerDto;

      // find all users-old
        const users: User[] = (await this.usersService.findAll({ limit: '-1' }))
          .data.data;

        if (users) {
      // Query DB for existing customer with the same email
      const emailExist = await UserModel.findOne({ email }).exec();

      // confirm Email
      if (emailExist) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The email you have provided already exists',
          data: null,
        });
      }

      // confirm phone
      // Query DB for existing customer with the same phone
      const phoneExist = await UserModel.findOne({ phone }).exec();

      if (phoneExist) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The phone number you have provided already exists',
          data: null,
        });
      }
      }  

      if (!acceptTerms) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'You must accept the terms and conditions to register',
          data: null,
        });
      }

      /**
       * Create a new customer data object with details like name, email,
       * phone etc. to be passed to customer.create() method.
       *
       * This takes the data from the input customerDto and formats it
       * into the PostCustomerDto type to match the DB model.
       */
      const customerData: PostCustomerDto = {
        name,
        email,
        phone,
        createdBy: 'system',
        acceptTerms,
        address: customerDto.address,
        password: customerDto.password,
      };

      const customer = await CustomerModel.create(customerData);

      /**
       * Create a user account for the new customer if requested.
       *
       * If the email and password, create a user account for the new
       * customer with their name, email, password etc. and link it to the new
       * customer document. Call the usersService to create the user in the DB.
       */

      const password: string = customerDto.password
        ? customerDto.password
        : generatePassword({ includeSpecialChars: true });
      const customerId = customer._id.toString();
        const role = await this.rolesService.getCustomerRole();
        // prepare the user dto
        const userData: PostUserDto = {
          customerId,
          name: name,
          email,
          password,
          phone,
          createdBy: 'system',
          roleId: role._id.toString(),
        };

      // create the user
        const user: User = (await this.usersService.create(userData)).data;

      // Emit the event that the customer has been created
      this.eventEmitter.emit(SystemEventsEnum.CustomerCreated, customer);
        this.eventEmitter.emit(SystemEventsEnum.UserCreated, user);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Customer account ${customer.name} created successfully!`,
        data: customer,
      });
    } catch (error) {
      this.logger.error(error);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an issue creating customer account ${customerDto.name}!`,
        data: error,
      });
    }
  }

  /**
   * Get a customer by ID.
   * @returns {Promise<Customer>} A promise that resolves to the customer document.
   */
  async findOne(data: {
    id: string | null;
    accountNumber: string | null;
  }): Promise<Customer | null> {
    const { accountNumber, id } = data;
    if (id) {
      return CustomerModel.findOne({ _id: id }).exec();
    }
    if (accountNumber) {
      return CustomerModel.findOne({ accountNumber }).exec();
    }
    return null;
  }

  /**
   * Update Customer details
   *
   * @param {string} id
   * @param {*} payload
   * @return {*}  {Promise<any>}
   * @memberof CustomerService
   */
  async update(id: string, payload: UpdateCustomerDto): Promise<Customer> {
    const filter = { _id: id };
    const update = payload;
    const updatedCustomer = await CustomerModel.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    // Emit the event that the customer has been created
    this.eventEmitter.emit(SystemEventsEnum.CustomerUpdated, updatedCustomer);
    return updatedCustomer;
  }

  /**
   * Get all Customers
   *
   * @return {*}  {Promise<HttpResponseInterface>}Poa
   * @memberof CustomerService
   */
  async getAllCustomers(
    query?: ExpressQuery,
  ): Promise<HttpResponseInterface<PaginatedData<Customer[]>>> {
    try {
      const totalDocuments = await CustomerModel.find().countDocuments().exec();
      const queryData = getCustomerQueryParams({ query, totalDocuments });
      const aggregation = CustomerAggregation(queryData);
      const { limit, page } = queryData;

      const data = await CustomerModel.aggregate<Customer>(aggregation).exec();

      const counts = await CustomerModel.aggregate([
        ...aggregation.slice(0, -2),
        { $count: 'count' },
      ]);

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      const response: PaginatedData<Customer[]> = {
        page,
        limit,
        total,
        data,
        pages,
      };

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Customer list loaded successfully!',
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
   * Get customer by ID
   *
   * @param {string} id - The ID of the customer to retrieve
   * @returns {Promise<HttpResponseInterface>} A promise resolving to the HTTP response containing the customer data
   */
  async getCustomerById(
    id: string,
  ): Promise<HttpResponseInterface<Customer | null>> {
    try {
      const queryData = getCustomerQueryParams({
        query: {
          customerId: id,
          limit: 1,
          skip: 0,
          page: 1,
        } as unknown as ExpressQuery,
        totalDocuments: 1,
      });
      const aggregation = CustomerAggregation(queryData);

      const [customer] = await CustomerModel.aggregate<Customer>(aggregation);

      if (!customer) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message:
            'There is no customer with the id you have provided. Try again!',
          data: null,
        });
      }
      this.eventEmitter.emit(SystemEventsEnum.CustomerUpdated, customer);
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Customer loaded successfully!',
        data: customer,
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
   * Update customer
   *
   * @param {string} id
   * @param {UpdateCustomerDto} data
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof CustomerService
   */
  async updateCustomer(
    id: string,
    data: UpdateCustomerDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: Partial<Customer> = data as unknown as Partial<Customer>;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      // Remove the fields to be updated
      const { _id, createdBy, createdAt, ...update } = payload;
      // update the customer group
      const customer = await CustomerModel.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });

      // Emit the event that the customer has been created
      this.eventEmitter.emit(SystemEventsEnum.CustomerUpdated, customer);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Customer updated successfully!',
        data: customer,
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
