import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HttpResponseInterface, ExpressQuery, PermissionEnum, UserRequest } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { RegisterCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { CustomersService } from '../services/customers.service';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';

@Controller('customers')
export class CustomersController {
  /**
   * Creates an instance of CustomerController.
   * @param {CustomersService} customerService - The customer service to use
   */
  constructor(private readonly customerService: CustomersService) {
    //
  }

  /**
   * POST handler to create a new customer.
   *
   * @param {RegisterCustomerDto} payload - The customer data to create
   * @param {any} req - The request object
   * @returns {Promise<HttpResponseInterface>} The response from creating the customer
   */
  @Post()
  async createCustomer(
    @Body() payload: RegisterCustomerDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // Create customer
    const response = await this.customerService.createCustomer(payload);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * GET handler to retrieve all customers with pagination and search.
   *
   * @param {ExpressQuery} query - Query parameters for pagination and search
   * @returns {Promise<HttpResponseInterface>} The response containing the customers list
   */
  @Get()
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.VIEW_CUSTOMER,
      PermissionEnum.MANAGE_CUSTOMERS,
    ])
  async getAllCustomers(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // Get all customers
    const response = await this.customerService.getAllCustomers(query);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * GET handler to retrieve a customer by ID.
   *
   * @param {string} id - The ID of the customer to retrieve.
   * @returns {Promise<HttpResponseInterface>} The response containing the requested customer.
   */
  @Get(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.VIEW_CUSTOMER,
      PermissionEnum.MANAGE_CUSTOMERS,
    ])
  async getCustomerById(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // Get customer by Id
    const response = await this.customerService.getCustomerById(id);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * PATCH handler to update a customer.
   *
   * @param {string} id - The ID of the customer to update
   * @param {UpdateCustomerDto } payload - The updated customer data
   * @param {any} req - The request object
   * @returns {Promise<HttpResponseInterface>} The response from updating the customer
   */
  @Patch(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.UPDATE_CUSTOMER,
      PermissionEnum.MANAGE_CUSTOMERS,
    ])
  async updateCustomer(
    @Param('id') id: string,
    @Body() payload: UpdateCustomerDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    // Update customer
    const response = await this.customerService.updateCustomer(id, payload, userId);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
