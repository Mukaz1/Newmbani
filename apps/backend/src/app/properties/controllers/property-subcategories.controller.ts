import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertySubCategoriesService } from '../services/property-subcategories.service';
import {
  ExpressQuery,
  HttpResponseInterface,
  PermissionEnum,
  UserRequest,
} from '@newmbani/types';
import {
  CreatePropertySubCategoryDto,
  UpdatePropertySubCategoryDto,
} from '../dtos/property-sub-category.dto';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';

@Controller('property-subcategories')
export class PropertySubCategoriesController {
  constructor(
    private readonly propertysubcategoriesService: PropertySubCategoriesService
  ) {}

  /**
   * Register a new property subcategory
   * @return {*} {Promise<HttpResponseInterface>}
   * @memberof PropertyCategoriesController
   * @param createPropertySubCategoryDto
   * @param res
   */
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.CREATE_PROPERTY_CATEGORY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ])
  async create(
    @Body() createPropertySubCategoryDto: CreatePropertySubCategoryDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    // create property subcategory
    const response = await this.propertysubcategoriesService.create({
      createPropertySubCategoryDto,
      userId,
    });
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all property subcategories
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
    const response = await this.propertysubcategoriesService.findAll(query);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Find a property subcategory using ID
   *
   * @param {string} id
   * @param res
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof PropertyCategoriesController
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const response = await this.propertysubcategoriesService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Update property subcategory
   * @param {string} id
   * @param updatePropertySubCategoryDto
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
    @Body() updatePropertySubCategoryDto: UpdatePropertySubCategoryDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    // Update property subcategory
    const response = await this.propertysubcategoriesService.update(
      id,
      updatePropertySubCategoryDto,
      userId
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Remove property subcategory
   *
   * @param {string} id
   * @return {*}
   * @memberof PropertyCategoriesController
   */
  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.DELETE_PROPERTY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ])
  async remove(@Param('id') id: string): Promise<any> {
    return this.propertysubcategoriesService.remove(id);
  }
}
