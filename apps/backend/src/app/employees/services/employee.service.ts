import { Global, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model, Types } from 'mongoose';
import {
  PostNewEmployeeDto,
  RegisterEmployeeDto,
} from '../dto/register-employee.dto';
import {
  DatabaseModelEnums,
  Employee,
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
  Role,
  RolesEnum,
  SystemEventsEnum,
  User,
} from '@newmbani/types';

import { EmployeeAggregation } from '../queries/employee-aggregator.helper';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import {
  EmployeeQueryData,
  getEmployeeQueryParams,
} from '../utils/getEmployeeQueryParams';
import { AuthorizationService } from '../../auth/services/authorization.service';
import { SyncSuperAdminDto } from '../../setup/dto/sync-db.dto';
import { generatePassword, CustomHttpResponse } from '../../common';
import { PostUserDto } from '../../auth/dto/users/register-user.dto';
import { UsersService } from '../../auth/services/users.service';

@Global()
@Injectable()
export class EmployeeService {
  private logger = new Logger(EmployeeService.name);
  constructor(
    @Inject(DatabaseModelEnums.EMPLOYEE) private employee: Model<Employee>,
    private readonly authorizationService: AuthorizationService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    //
  }

  async syncAdminUser(
    payload: SyncSuperAdminDto,
  ): Promise<HttpResponseInterface> {
    try {
      // Get the id of the admin role
      const roles: Role[] = (
        await this.authorizationService.getAllRoles({
          query: {} as ExpressQuery,
        })
      ).data;
      if (roles.length > 0) {
        const role: Role = roles.find((ro: Role) => {
          return ro.name === RolesEnum.SuperAdminRole;
        });

        // Get the role ID
        const roleId = role._id.toString();
        // generate a random password for the user
        const password: string = payload.password
          ? payload.password
          : generatePassword({ includeSpecialChars: true });

        // Prepare the employee payload
        const newEmployeeDto: RegisterEmployeeDto = {
          name: payload.name ? payload.name : 'Admin',
          email: payload.email,
          password,
          phone: payload.phone,
          roleId,
        };

        const user: User | null = (
          await this.create({ newEmployeeDto, createdBy: 'system' })
        ).data;

        // sync database
        this.eventEmitter.emit(
          SystemEventsEnum.SyncDatabase,
          user._id.toString(),
        );

        /**
         * Emits a SuperUserAccountCreated event with the settings-wrapper and user data.
         * This notifies other parts of the system that a new super user account has been created.
         */
        this.eventEmitter.emit(SystemEventsEnum.SuperUserAccountCreated, {
          user,
        });

        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.CREATED,
          message: `Super User was created successfully!`,
          data: user,
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
  /**
   * Create a user account
   * @returns Promise<HttpResponseInterface>
   * @param userDto
   */
  async create(data: {
    newEmployeeDto: RegisterEmployeeDto;
    createdBy: string;
  }): Promise<HttpResponseInterface<User | null>> {
    try {
      const { newEmployeeDto, createdBy } = data;
      const { password, email, name, phone, roleId } = newEmployeeDto;

      let employee: Employee | null = await this.checkEmailAndPhoneUnique({
        email,
        phone,
      });

      // confirm Email
      if (employee && employee.email === email) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The email you have provided already exists',
          data: null,
        });
      }

      // confirm phone

      if (employee && employee.phone === phone) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'The phone number you have provided already exists',
          data: null,
        });
      }

      // Prepare Employee Data
      const employeeData: PostNewEmployeeDto = {
        email: email.toLowerCase(),
        phone: phone,
        name: name,
        roleId,
        createdBy: createdBy,
      };
      employee = await this.employee.create(employeeData);

      // Prepare user account for employee
      const userData: PostUserDto = {
        employeeId: employee._id.toString(),
        name,
        email,
        password,
        phone,
        createdBy: createdBy === 'system' ? undefined : createdBy,
        roleId,
      };

      const user: User = (await this.usersService.create(userData))
        .data as User;

      // Emit events
      this.eventEmitter.emit(SystemEventsEnum.EmployeeAccountCreated, employee);
      this.eventEmitter.emit(SystemEventsEnum.UserCreated, user);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Employee account ${employee.name} created successfully!`,
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
  /**
   * Get all employees from the database
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof EmployeeService
   */
  async findAll(
    query?: ExpressQuery,
  ): Promise<HttpResponseInterface<PaginatedData<Employee>> | null> {
    try {
      const totalDocuments = await this.employee.countDocuments().exec();
      const queryData: EmployeeQueryData = getEmployeeQueryParams({
        query,
        totalDocuments,
      });
      const { limit, page } = queryData;
      const aggregation = EmployeeAggregation(queryData);
      const data = await this.employee.aggregate<Employee>(aggregation).exec();

      const counts = await this.employee
        .aggregate([...aggregation.slice(0, -2), { $count: 'count' }])
        .exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData<Employee[]> = {
        page,
        limit,
        total,
        data,
        pages,
      };
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Employees loaded successfully!',
        data: response,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    }
  }

  async checkEmailAndPhoneUnique(data: {
    email: string;
    phone: string;
  }): Promise<Employee | null> {
    try {
      const employee: Employee | null = await this.employee.findOne({
        $or: [data],
      });

      return employee;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get a employee using their email
   *
   * @param {string} id
   * @return {*}  {Promise<Employee>}
   * @memberof EmployeeService
   */
  async findOne(data: {
    employeeId?: string;
    email?: string;
    phone?: string;
  }): Promise<HttpResponseInterface<Employee | null>> {
    try {
      const queryData: EmployeeQueryData = await getEmployeeQueryParams({
        query: {
          ...data,
          limit: 1,
          skip: 0,
          page: 1,
        } as unknown as ExpressQuery,
        totalDocuments: 1,
      });
      const aggregation = EmployeeAggregation(queryData);
      const [employee] = await this.employee
        .aggregate<Employee>(aggregation)
        .exec();

      if (!employee) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: 'Employee not found!',
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Employee found!',
        data: employee,
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
   * Update a employee
   * @param {string} id
   * @param data
   * @param employeeId
   * @return {*}  {Promise<any>}
   * @memberof EmployeeService
   */
  async update(
    id: string,
    data: Partial<Employee> | UpdateEmployeeDto,
    employeeId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: new Types.ObjectId(id) };
      const payload: Partial<Employee> = data as Partial<Employee>;
      payload.updatedBy = employeeId;
      payload.updatedAt = new Date();

      const updateRes = await this.employee.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Employee records updated',
        data: (await this.findOne({ employeeId: updateRes._id.toString() }))
          .data,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    }
  }

  async remove(id: string): Promise<Employee | null> {
    return this.employee.findByIdAndDelete(id).exec();
  }
}
