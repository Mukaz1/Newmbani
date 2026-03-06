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

import {
  ExpressQuery,
  HttpResponseInterface,
  PermissionEnum,
  UserRequest,
} from '@newmbani/types';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import {
  CreatePropertyImageCategoryDto,
  UpdatePropertyImageCategoryDto,
} from '../dtos/property-image-category.dto';
import { PropertyImageCategoriesService } from '../services/property-image-categories.service';

@Controller('property-image-categories')
export class PropertyImageCategoriesController {
  /**
   * Creates an instance of PropertyImageCategoriesController.
   * @param {PropertyImageCategoriesService} propertyImageCategoriesService
   */
  constructor(
    private readonly propertyImageCategoriesService: PropertyImageCategoriesService
  ) {}

  /**
   * Register a new property-image category
   */
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.CREATE_PROPERTY_CATEGORY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ])
  async create(
    @Body() createPropertyImageCategoryDto: CreatePropertyImageCategoryDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    const response = await this.propertyImageCategoriesService.create({
      createPropertyImageCategoryDto,
      userId,
    });
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Get all property image categories
   */
  @Get()
  async findAll(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const response = await this.propertyImageCategoriesService.findAll(query);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Find an property image category by ID
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const response = await this.propertyImageCategoriesService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Update an property image category
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.UPDATE_PROPERTY_CATEGORY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ])
  async update(
    @Param('id') id: string,
    @Body() updatePropertyImageCategoryDto: UpdatePropertyImageCategoryDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    const response = await this.propertyImageCategoriesService.update(
      id,
      updatePropertyImageCategoryDto,
      userId
    );
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Remove an property image category
   */
  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.DELETE_PROPERTY_CATEGORY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ])
  async remove(@Param('id') id: string): Promise<HttpResponseInterface> {
    const response = this.propertyImageCategoriesService.remove(id);

    return response;
  }
}
