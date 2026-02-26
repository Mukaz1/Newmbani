import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HttpResponseInterface } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { ExpressQuery } from '@newmbani/types';
import { CreatePropertyDto, UpdatePropertyDto } from '../dtos/properties.dto';
import { PropertiesService } from '../services/properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * Register a new property
   */
  @Post()
  //   @UseGuards(AuthenticationGuard, AuthorizationGuard)
  //   @RequiredPermissions([
  //     PermissionEnum.CREATE_PROPERTY,
  //     PermissionEnum.MANAGE_PROPERTIES,
  //   ])
  async create(
    @Body() propertyDto: CreatePropertyDto,
    // @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.propertiesService.create({
      propertyDto,
      userId: 'system', //_id.toString(),
    });

    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Get all properties
   */
  @Get()
  async findAll(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.propertiesService.findAll(query);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Find a property using ID
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.propertiesService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Update property
   */
  @Patch(':id')
  //   @UseGuards(AuthenticationGuard, AuthorizationGuard)
  //   @RequiredPermissions([
  //     PermissionEnum.UPDATE_PROPERTY,
  //     PermissionEnum.MANAGE_PROPERTIES,
  //   ])
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    // @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const userId = 'system'; //user._id.toString();

    const response = await this.propertiesService.update(
      id,
      updatePropertyDto,
      userId,
    );

    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Remove property
   */
  @Delete(':id')
  //   @UseGuards(AuthenticationGuard, AuthorizationGuard)
  //   @RequiredPermissions([
  //     PermissionEnum.DELETE_PROPERTY,
  //     PermissionEnum.MANAGE_PROPERTIES,
  //   ])
  async remove(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.propertiesService.remove(id);
    res.setStatus(response.statusCode);
    return response;
  }
}
