import { Injectable } from '@nestjs/common';
import { CustomHttpResponse } from '../../common';
import {
  ExpressQuery,
  FileTypesEnum,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PropertyImage,
  PropertyImageApprovalStatus,
  SystemEventsEnum,
  PaginatedData,
} from '@newmbani/types';
import { PropertyImageModel } from '../schemas/property-image.schema';
import {
  CreatePropertyImageDto,
  PostUpdatePropertyImageDto,
  PropertyImageReviewDto,
  UpdatePropertyImageDto,
} from '../dtos/property-image.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AggregatePropertyImageCategories } from '../queries/property-image.aggregator';
import { getPropertyImageQueryParams } from '../utils/getPropertyImageQueryParams';
import { PipelineStage } from 'mongoose';
import { FilesService } from '../../files/services/files.service';

@Injectable()
export class PropertyImagesService {
  constructor(
    private readonly fileService: FilesService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(data: {
    files: Array<Express.Multer.File>;
    userId: string;
    payload: CreatePropertyImageDto;
  }): Promise<HttpResponseInterface<PropertyImage[] | null>> {
    try {
      const { files, userId, payload } = data;

      if (files.length < 1) {
        return new CustomHttpResponse({
          data: null,
          message: 'No files provided for property image upload.',
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        });
      }

      const createdImages: PropertyImage[] = [];

      for (const file of files) {
        const propertyImageDoc = await PropertyImageModel.create({
          propertyId: payload.propertyId,
          propertyImageCategoryId: payload.propertyImageCategoryId,
          description: payload.description,
          approvalStatus: PropertyImageApprovalStatus.PENDING_REVIEW,
          createdAt: new Date(),
          createdBy: userId,
        });

        const { data: fileEntry } = await this.fileService.uploadFile({
          file,
          userId,
          payload: {
            reference: propertyImageDoc._id.toString(),
            type: FileTypesEnum.PROPERTY_IMAGE,
            description: payload.description,
          },
        });

        const updatedImage = await PropertyImageModel.findByIdAndUpdate(
          propertyImageDoc._id.toString(),
          {
            fileId: fileEntry._id.toString(),
            link: fileEntry.url,
          },
          { new: true }
        ).exec();

        if (updatedImage) {
          createdImages.push(updatedImage);
        }
      }

      this.eventEmitter.emit(
        SystemEventsEnum.PropertyImageUploaded,
        createdImages
      );

      return new CustomHttpResponse({
        data: createdImages,
        message: 'Property image(s) uploaded successfully.',
        statusCode: HttpStatusCodeEnum.CREATED,
      });
    } catch (error) {
      console.error(error);
      return new CustomHttpResponse({
        data: null,
        message:
          'An error occurred while creating and uploading property image.',
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async remove(id: string): Promise<HttpResponseInterface<null>> {
    try {
      await PropertyImageModel.findByIdAndDelete(id).exec();
      return new CustomHttpResponse({
        data: null,
        message: 'Property image removed successfully.',
        statusCode: HttpStatusCodeEnum.OK,
      });
    } catch (error) {
      return new CustomHttpResponse({
        data: null,
        message: 'An error occurred while removing the property image.',
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Retrieve all property images using aggregation, filtering, pagination, and sorting options.
   *
   * @param query - The query object containing filters, pagination, and sorting options.
   * @returns A promise that resolves to an HTTP response containing the list of property images or an error message.
   */
  async findAll(
    query: ExpressQuery
  ): Promise<HttpResponseInterface<PaginatedData<PropertyImage[]>>> {
    try {
      const totalDocuments = await PropertyImageModel.find()
        .countDocuments()
        .exec();
      const queryProps = getPropertyImageQueryParams(query, totalDocuments);

      const { limit, skip } = queryProps;

      const pipeline: PipelineStage[] = await AggregatePropertyImageCategories(
        queryProps
      );

      const images: PropertyImage[] = await PropertyImageModel.aggregate(
        pipeline
      ).exec();

      // For total count, remove skip and limit
      const countPipeline: PipelineStage[] = pipeline.filter(
        (stage) => !('$skip' in stage) && !('$limit' in stage)
      );
      countPipeline.push({ $count: 'count' });

      const countResults = await PropertyImageModel.aggregate(
        countPipeline
      ).exec();
      const total = countResults.length > 0 ? countResults[0].count : 0;
      const page = skip / limit + 1;
      const pages = Math.ceil(total / limit);

      const data: PaginatedData<PropertyImage[]> = {
        page,
        limit,
        total,
        pages,
        data: images,
      };

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Property images fetched successfully.',
        data,
      });
    } catch (error) {
      return new CustomHttpResponse({
        data: null,
        message: 'An error occurred while fetching property images.',
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updatePropertyImageCategory(data: {
    propertyImageId: string;
    updatePropertyImageDto: UpdatePropertyImageDto;
    userId: string;
  }): Promise<HttpResponseInterface<PropertyImage>> {
    const { propertyImageId, updatePropertyImageDto, userId } = data;

    try {
      const filter = { _id: propertyImageId };

      const payload: PostUpdatePropertyImageDto = {
        ...updatePropertyImageDto,
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const propertyImage = await PropertyImageModel.findOneAndUpdate(
        filter,
        payload,
        {
          new: true,
        }
      ).exec();

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property image updated successfully!`,
        data: propertyImage,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  async reviewPropertyImage(data: {
    propertyImageId: string;
    payload: PropertyImageReviewDto;
  }): Promise<HttpResponseInterface<PropertyImage>> {
    try {
      const { propertyImageId } = data;
      const { comment, status } = data.payload;

      const propertyImage: PropertyImage | null =
        await PropertyImageModel.findById(propertyImageId).exec();
      if (!propertyImage) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: 'Property not found!',
          data: null,
        });
      }

      const reviewedPropertyImage = await PropertyImageModel.findOneAndUpdate(
        { _id: propertyImageId },
        {
          approvalStatus: status,
          updatedAt: new Date(),
          reviewComment: comment,
        },
        { new: true }
      ).exec();

      switch (status) {
        case PropertyImageApprovalStatus.APPROVED:
          this.eventEmitter.emit(
            SystemEventsEnum.PropertyImageApproved,
            reviewedPropertyImage
          );
          break;
        case PropertyImageApprovalStatus.REJECTED:
          this.eventEmitter.emit(
            SystemEventsEnum.PropertyImageRejected,
            reviewedPropertyImage
          );
          break;
        default:
          // no event emitted for PENDING_REVIEW or unknown status
          break;
      }

      let message: string;
      switch (status) {
        case PropertyImageApprovalStatus.APPROVED:
          message = 'Property image approved successfully!';
          break;
        case PropertyImageApprovalStatus.REJECTED:
          message = 'Property image has been rejected!';
          break;
        case PropertyImageApprovalStatus.PENDING_REVIEW:
          message = 'Property image is now pending review!';
          break;
        default:
          message = 'Property image status updated.';
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message,
        data: reviewedPropertyImage,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      });
    }
  }
}
