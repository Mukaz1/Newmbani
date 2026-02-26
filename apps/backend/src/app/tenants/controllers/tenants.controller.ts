import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpResponseInterface, ExpressQuery } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { CreateTenantDto, UpdateTenantDto } from '../dtos/tenant.dto';
import { TenantsService } from '../services/tenants.service';

@Controller('tenants')
export class TenantsController {
  /**
   * Creates an instance of TenantController.
   * @param {TenantsService} tenantService - The tenant service to use
   */
  constructor(private readonly tenantService: TenantsService) {
    //
  }

  /**
   * POST handler to create a new tenant.
   *
   * @param {RegisterTenantDto} payload - The tenant data to create
   * @param {any} req - The request object
   * @returns {Promise<HttpResponseInterface>} The response from creating the tenant
   */
  @Post()
  //   @UseGuards(AuthenticationGuard, AuthorizationGuard)
  //   @RequiredPermissions([
  //     PermissionEnum.CREATE_TENANT,
  //     PermissionEnum.MANAGE_TENANTS,
  //   ])
  async createTenant(
    @Body() payload: CreateTenantDto,
    // @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const userId = 'system'; // user._id.toString();
    // Create tenant
    const response = await this.tenantService.createTenant(payload, userId);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * GET handler to retrieve all tenants with pagination and search.
   *
   * @param {ExpressQuery} query - Query parameters for pagination and search
   * @returns {Promise<HttpResponseInterface>} The response containing the tenants list
   */
  @Get()
  //   @UseGuards(AuthenticationGuard, AuthorizationGuard)
  //   @RequiredPermissions([
  //     PermissionEnum.VIEW_TENANT,
  //     PermissionEnum.MANAGE_TENANTS,
  //   ])
  async getAllTenants(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // Get all tenants
    const response = await this.tenantService.getAllTenants(query);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * GET handler to retrieve a tenant by ID.
   *
   * @param {string} id - The ID of the tenant to retrieve.
   * @returns {Promise<HttpResponseInterface>} The response containing the requested tenant.
   */
  @Get(':id')
  //   @UseGuards(AuthenticationGuard, AuthorizationGuard)
  //   @RequiredPermissions([
  //     PermissionEnum.VIEW_TENANT,
  //     PermissionEnum.MANAGE_TENANTS,
  //   ])
  async getTenantById(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // Get tenant by Id
    const response = await this.tenantService.getTenantById(id);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * PATCH handler to update a tenant.
   *
   * @param {string} id - The ID of the tenant to update
   * @param {UpdateTenantDto } payload - The updated tenant data
   * @param {any} req - The request object
   * @returns {Promise<HttpResponseInterface>} The response from updating the tenant
   */
  @Patch(':id')
  //   @UseGuards(AuthenticationGuard, AuthorizationGuard)
  //   @RequiredPermissions([
  //     PermissionEnum.UPDATE_TENANT,
  //     PermissionEnum.MANAGE_TENANTS,
  //   ])
  async updateTenant(
    @Param('id') id: string,
    @Body() payload: UpdateTenantDto,
    // @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const userId = 'system'; //user._id.toString();
    // Update tenant
    const response = await this.tenantService.updateTenant(id, payload, userId);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
