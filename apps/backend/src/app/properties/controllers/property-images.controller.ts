import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PropertyImagesService } from '../services/property-images.service';
import {
  ExpressQuery,
  HttpResponseInterface,
  PermissionEnum,
  User,
} from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  CreatePropertyImageDto,
  PropertyImageReviewDto,
  UpdatePropertyImageDto,
} from '../dtos/property-image.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('property-images')
export class PropertyImagesController {
  constructor(private readonly propertyImagesService: PropertyImagesService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.CREATE_PROPERTY,
    PermissionEnum.MANAGE_PROPERTIES,
  ])
  @UseInterceptors(
    // Use FilesInterceptor to accept multiple files
    // Optionally, you can set a file limit (e.g., maxCount: 10)
    // and customize storage as needed
    require('multer').FilesInterceptor
      ? require('multer').FilesInterceptor('files', 20, {
          storage: diskStorage({
            filename: (req, file, callback) => {
              const prefix =
                Number(Date.now()).toString(36) +
                '-' +
                Math.round(Math.random() * 1e6).toString(36);
              const ext = extname(file.originalname);
              const baseName = file.originalname.split('.')[0];
              const fileName = `${baseName}-${prefix}${ext}`;
              callback(null, fileName);
            },
          }),
        })
      : require('@nestjs/platform-express').FilesInterceptor('files', 20, {
          storage: diskStorage({
            filename: (req, file, callback) => {
              const prefix =
                Number(Date.now()).toString(36) +
                '-' +
                Math.round(Math.random() * 1e6).toString(36);
              const ext = extname(file.originalname);
              const baseName = file.originalname.split('.')[0];
              const fileName = `${baseName}-${prefix}${ext}`;
              callback(null, fileName);
            },
          }),
        })
  )
  async createPropertyImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() payload: CreatePropertyImageDto,
    @CurrentUser() user: User,
    @GenericResponse() res: GenericResponse
  ) {
    const response = await this.propertyImagesService.create({
      userId: user._id.toString(),
      files,
      payload,
    });
    res.setStatus(response.statusCode);
    return response;
  }

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_PROPERTY,
    PermissionEnum.MANAGE_PROPERTIES,
  ])
  async getPropertyImages(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse
  ) {
    const response = await this.propertyImagesService.findAll(query);
    res.setStatus(response.statusCode);
    return response;
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.DELETE_PROPERTY,
    PermissionEnum.MANAGE_PROPERTIES,
  ])
  async removePropertyImage(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse
  ) {
    const response = await this.propertyImagesService.remove(id);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Review property (approve or reject)
   */
  @Patch(':id/review')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.UPDATE_PROPERTY,
    PermissionEnum.MANAGE_PROPERTIES,
    PermissionEnum.REVIEW_PROPERTIES,
  ])
  async reviewProperty(
    @Param('id') propertyImageId: string,
    @Body() reviewDto: PropertyImageReviewDto,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const response = await this.propertyImagesService.reviewPropertyImage({
      propertyImageId,
      payload: reviewDto,
    });
    res.setStatus(response.statusCode);
    return response;
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.UPDATE_PROPERTY,
    PermissionEnum.MANAGE_PROPERTIES,
  ])
  async updatePropertyImage(
    @Param('id') propertyImageId: string,
    @Body() updatePropertyImageDto: UpdatePropertyImageDto,
    @CurrentUser() user: User,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    const response =
      await this.propertyImagesService.updatePropertyImageCategory({
        propertyImageId,
        updatePropertyImageDto,
        userId,
      });
    res.setStatus(response.statusCode);
    return response;
  }
}
