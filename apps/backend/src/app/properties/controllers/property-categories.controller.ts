import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PropertyCategoriesService } from '../services/property-categories.service';
import {
  CreatePropertyCategoryDto,
  UpdatePropertyCategoryDto,
} from '../dtos/property-category.dto';
import { ExpressQuery, HttpResponseInterface, PermissionEnum, UserRequest } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';

@Controller('property-categories')
  export class PropertyCategoriesController {
    /**
     * Creates an instance of PropertyCategoriesController.
     * @param {CategoriesService} categoriesService - A service that contains all the business logic for the property categories.
     */
    constructor(private readonly categoriesService: PropertyCategoriesService) {}
  
  /**
   * Register a new property category
   * @return {*} {Promise<HttpResponseInterface>}
   * @memberof PropertyCategoriesController
   * @param createPropertyCategoryDto
   * @param res
   */
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.CREATE_PROPERTY_CATEGORY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ])
  async create(
    @Body() createPropertyCategoryDto: CreatePropertyCategoryDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    const response = await this.categoriesService.create(
      createPropertyCategoryDto,
      userId
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
  
    /**
     * Get all property categories
     *
     * @return {*}  {Promise<HttpResponseInterface>}
     * @memberof PropertyCategoriesController
     */
    @Get()
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.VIEW_PROPERTY_CATEGORY,
      PermissionEnum.VIEW_PROPERTY_CATEGORIES,
    ])
    async findAll(
      @Query() query: ExpressQuery,
      @GenericResponse() res: GenericResponse
    ): Promise<HttpResponseInterface> {
      // get all accounts
      const response = await this.categoriesService.findAll(query);
      res.setStatus(response.statusCode);
      return response;
    }
  
    /**
     * Find a property category using ID
     *
     * @param {string} id
     * @return {*}  {Promise<HttpResponseInterface>}
     * @memberof PropertyCategoriesController
     * @param res
     */
    @Get(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.VIEW_PROPERTY_CATEGORY,
      PermissionEnum.VIEW_PROPERTY_CATEGORIES,
    ])
    async findOne(
      @Param('id') id: string,
      @GenericResponse() res: GenericResponse
    ): Promise<HttpResponseInterface> {
      const response = await this.categoriesService.findOne(id);
      res.setStatus(response.statusCode);
      return response;
    }
  
    /**
     * Update property category
     * @param {string} id
     * @param updatePropertyCategoryDto
     * @param res
     * @return {*} {Promise<HttpResponseInterface>}
     * @memberof PropertyCategoriesController
     */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.UPDATE_PROPERTY_CATEGORY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ])
  async update(
    @Param('id') id: string,
    @Body() updatePropertyCategoryDto: UpdatePropertyCategoryDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
      const userId = user._id.toString();
    const response = await this.categoriesService.update(
      id,
      updatePropertyCategoryDto,
      userId
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
  
    /**
     * Remove property category
     *
     * @param {string} id
     * @return {*}
     * @memberof PropertyCategoriesController
     */
    @Delete(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.DELETE_PROPERTY_CATEGORY,
      PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
    ])
    remove(@Param('id') id: string) {
      return this.categoriesService.remove(id);
    }
  }
  