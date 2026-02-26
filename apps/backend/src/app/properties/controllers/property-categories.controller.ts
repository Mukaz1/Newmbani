import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PropertyCategoriesService } from '../services/property-categories.service';
import {
  CreatePropertyCategoryDto,
  UpdatePropertyCategoryDto,
} from '../dtos/property-category.dto';
import { ExpressQuery, HttpResponseInterface } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';

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
  async create(
    @Body() createPropertyCategoryDto: CreatePropertyCategoryDto,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    // TODO: wire userId from auth later
    const response = await this.categoriesService.create(
      createPropertyCategoryDto,
      'system'
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
  async update(
    @Param('id') id: string,
    @Body() updatePropertyCategoryDto: UpdatePropertyCategoryDto,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    // TODO: wire userId from auth later
    const response = await this.categoriesService.update(
      id,
      updatePropertyCategoryDto,
      'system'
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
    // @UseGuards(AuthenticationGuard, AuthorizationGuard)
    // @RequiredPermissions([
    //   PermissionEnum.DELETE_PROPERTY,
    //   PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
    // ])
    remove(@Param('id') id: string) {
      return this.categoriesService.remove(id);
    }
  }
  