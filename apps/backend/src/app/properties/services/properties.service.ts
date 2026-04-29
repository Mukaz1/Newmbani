import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  ExpressQuery,
  Property,
  PaginatedData,
  SystemEventsEnum,
  PropertyApprovalStatus,
  LandlordApprovalStatus,
} from '@newmbani/types';
import { PipelineStage } from 'mongoose';
import {
  CustomHttpResponse,
  generateSlug,
  getSlugAndId,
  QrCodeService,
} from '../../common';
import {
  CreatePropertyDto,
  PostCreatePropertyDto,
  PostUpdatePropertyDto,
  PropertyReviewDto,
  UpdatePropertyDto,
} from '../dtos/properties.dto';
import { AggregateProperties } from '../queries/properties.query';
import { PropertyModel } from '../schemas/properties.schema';
import { getPropertyQueryParams } from '../utils/getPropertiesParams';
import { LandlordModel } from '../../landlords/schemas/landlord.schema';
import { UserModel } from '../../auth/schemas/user.schema';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly qrCodeService: QrCodeService,
  ) {}

  /**
   * Register a new Property
   */
  async create(data: {
    propertyDto: CreatePropertyDto;
    userId: string;
  }): Promise<HttpResponseInterface> {
    const { propertyDto, userId } = data;
    const landlordId = propertyDto.landlordId;
    try {
      let foundLandlord: any = null;

      // If landlordId is provided, check if landlord exists first, then check if they are verified
      if (landlordId) {
        foundLandlord = await LandlordModel.findById(landlordId).exec();

        if (!foundLandlord) {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: `The landlord provided is not found.`,
            data: null,
          });
        }

        if (foundLandlord.approvalStatus !== LandlordApprovalStatus.APPROVED) {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: `The landlord provided is not approved.`,
            data: null,
          });
        }
      }

      // enforce PostCreatePropertyDto from CreatePropertyDto
      const payload: PostCreatePropertyDto = {
        ...propertyDto,
        createdBy: userId,
        approvalStatus: PropertyApprovalStatus.UNDER_REVIEW,
        slug: generateSlug(propertyDto.title),
        landlordId: landlordId ?? propertyDto.landlordId,
      };

      // store property
      const property = await PropertyModel.create(payload);

      // emit event
      this.eventEmitter.emit(SystemEventsEnum.PropertyCreated, property);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `The property ${propertyDto.title} has been created successfully`,
        data: (await this.findOne(property._id.toString())).data,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error creating the property ${propertyDto.title}`,
        data: error,
      });
    }
  }

  /**
   * Find all properties
   */
  async findAll(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const totalDocuments = await PropertyModel.find().countDocuments().exec();
      const queryProps: any = await getPropertyQueryParams(
        query,
        totalDocuments,
      );

      const { page, limit } = queryProps;

      const search = await AggregateProperties(queryProps);

      const categories: Property[] = await PropertyModel.aggregate(
        search as PipelineStage[],
      ).exec();

      const countsPipeline: PipelineStage[] = [
        ...(search.filter(Boolean) as PipelineStage[]),
        { $count: 'count' },
      ];

      const counts = await PropertyModel.aggregate(countsPipeline).exec();
      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Properties loaded from database successfully!',
        data: { page, limit, total, data: categories, pages } as PaginatedData,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an issue loading properties from database',
        data: error,
      });
    }
  }

  /**
   * Find one property by ID or slug
   */
  async findOne(id: string): Promise<HttpResponseInterface<Property>> {
    const q = getSlugAndId(id);
    const propertyId: string | undefined = q.id;
    const slug: string | undefined = q.slug;

    try {
      const queryProps = await getPropertyQueryParams(
        {
          propertyId,
          slug,
        },
        1,
      );
      const query = await AggregateProperties(queryProps);

      const propertiesQuery: Property[] = await PropertyModel.aggregate(
        query as any[],
      ).exec();
      const property: Property | undefined = propertiesQuery[0];

      if (property) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.OK,
          message: `The property with id ${propertyId ?? slug} found`,
          data: property,
        });
      } else {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `The property with id ${propertyId ?? slug} not found`,
          data: null,
        });
      }
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error getting the property with the id ${
          propertyId ?? slug
        }`,
        data: error,
      });
    }
  }

  /**
   * Update Property
   */
  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };

      const property = await PropertyModel.findById(id);
      if (!property) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Property not found`,
          data: null,
        });
      }

      const payload: PostUpdatePropertyDto = {
        ...updatePropertyDto,
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const updatedProperty = await PropertyModel.findOneAndUpdate(
        filter,
        payload,
        {
          new: true,
        },
      );

      this.eventEmitter.emit(SystemEventsEnum.PropertyUpdated, updatedProperty);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property ${updatePropertyDto.title} updated successfully!`,
        data: updatedProperty,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Update Property
   */
  async reviewProperty(
    id: string,
    reviewPropertyDto: PropertyReviewDto,
    userId: string,
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };

      const property = await PropertyModel.findById(id);
      if (!property) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Property not found`,
          data: null,
        });
      }

      const payload = {
        approvalStatus: reviewPropertyDto.status,
        reviewComment: reviewPropertyDto.reviewComment,
        updatedBy: userId,
        updatedAt: new Date(),
      };

      const updatedProperty = await PropertyModel.findOneAndUpdate(
        filter,
        payload,
        {
          new: true,
        },
      );

      this.eventEmitter.emit(SystemEventsEnum.PropertyUpdated, updatedProperty);
      if (
        payload.approvalStatus === PropertyApprovalStatus.APPROVED &&
        updatedProperty.approvalStatus === PropertyApprovalStatus.APPROVED
      ) {
        this.eventEmitter.emit(
          SystemEventsEnum.PropertyApproved,
          updatedProperty,
        );
      } else if (
        payload.approvalStatus === PropertyApprovalStatus.REJECTED &&
        updatedProperty.approvalStatus === PropertyApprovalStatus.REJECTED
      ) {
        this.eventEmitter.emit(
          SystemEventsEnum.PropertyRejected,
          updatedProperty,
        );
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property ${updatedProperty.title} reviewed successfully!`,
        data: updatedProperty,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  /**
   * Remove property
   */
  async remove(id: string): Promise<HttpResponseInterface> {
    try {
      await PropertyModel.deleteOne({ _id: id }).exec();

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property ${id} removed successfully!`,
        data: null,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Error removing property ${id}`,
        data: error,
      });
    }
  }

  async generatePropertyQRCode(
    propertyId: string,
    userId: string,
  ): Promise<HttpResponseInterface<any>> {
    try {
      // 1. Find property
      const property = await PropertyModel.findById(propertyId).exec();
      const user = await UserModel.findById(userId).exec();
      if (!property) {
        throw new NotFoundException(`Property ${propertyId} not found`);
      }

      // 2. Ownership check (critical, don’t get lazy here)
      if (property.landlordId.toString() !== user.landlordId?.toString()) {
        throw new ForbiddenException(
          'You are not allowed to generate QR for this property',
        );
      }

      // 3. Optional: only allow approved properties
      // (prevents QR codes for rejected/draft listings)
      if (property.approvalStatus !== PropertyApprovalStatus.APPROVED) {
        throw new ForbiddenException(
          'Only approved properties can have QR codes',
        );
      }

      if (property.qrCode) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.OK,
          message: 'QR Code fetched successfully',
          data: {
            qrCode: property.qrCode,
            cached: true,
          },
        });
      }

      const url = `${process.env.FRONTEND_URL}/properties/${propertyId}`;
      const qrCode = await this.qrCodeService.generateQRCode(url);

      // 💾 Save it
      property.qrCode = qrCode;
      await property.save();

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'QR Code generated successfully',
        data: {
          qrCode,
          cached: false,
        },
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: error.status || HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to generate QR code',
        data: null,
      });
    }
  }
}
