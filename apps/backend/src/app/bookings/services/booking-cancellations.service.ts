import { Injectable } from '@nestjs/common';
import {
  BookingCancellation,
  BookingStatusEnum,
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
} from '@newmbani/types';
import { CustomHttpResponse } from '../../common';
import { PipelineStage } from 'mongoose';
import { CreateBookingCancellationDto } from '../dto/booking-cancellations.dto';
import { BookingCancellationAggregation } from '../queries/booking-cancellations.query';
import { BookingCancellationModel } from '../schemas/booking-cancellation.schema';
import { BookingModel } from '../schemas/booking.schema';
import { getBookingCancellationParams, BookingCancellationQueryPayload } from '../utils/getBookingCancellationParams';
import { BookingsService } from './bookings.service';
import { UpdateBookingStatusDto } from '../dto/bookings.dto';

@Injectable()
export class BookingCancellationsService {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create a cancellation, then set the related booking status to cancelled.
   */
  async create(
    dto: CreateBookingCancellationDto,
    userId: string,
  ): Promise<HttpResponseInterface<BookingCancellation>> {
    try {
      const booking = await BookingModel.findById(dto.bookingId).exec();
      if (!booking) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Booking with id ${dto.bookingId} not found`,
          data: null,
        });
      }

      if (booking.customerId?.toString() !== dto.customerId) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.FORBIDDEN,
          message: 'This booking does not belong to the given customer',
          data: null,
        });
      }

      if (booking.status === BookingStatusEnum.CANCELLED) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: 'This booking is already cancelled',
          data: null,
        });
      }

      const existing = await BookingCancellationModel.findOne({
        bookingId: dto.bookingId,
      }).exec();
      if (existing) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.CONFLICT,
          message: 'A cancellation already exists for this booking',
          data: null,
        });
      }

      const payload = {
        ...dto,
        createdBy: userId,
        createdAt: new Date(),
      };

      const created = await BookingCancellationModel.create(payload);

      const markResult = await this.bookingsService.updateBookingStatus(
        dto.bookingId,
        { status: BookingStatusEnum.CANCELLED } as UpdateBookingStatusDto,
      );

      if (markResult.statusCode !== HttpStatusCodeEnum.OK) {
        await BookingCancellationModel.deleteOne({ _id: created._id }).exec();
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message: markResult.message ?? 'Could not update booking status after creating cancellation',
          data: null,
        });
      }

      const cancellationResponse = await this.findOne(created._id.toString());

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: 'Booking cancellation created and booking marked as cancelled',
        data: cancellationResponse.data ?? created,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an error cancelling the booking',
        data: error,
      });
    }
  }

  /**
   * List cancellations with pagination and optional filters (keyword, bookingId).
   */
  async findAll(query?: ExpressQuery): Promise<HttpResponseInterface<PaginatedData<BookingCancellation[]>>> {
    try {
      const totalDocuments = await BookingCancellationModel.countDocuments().exec();
      const payload: BookingCancellationQueryPayload = await getBookingCancellationParams({
        query: query || {},
        totalDocuments,
      });

      const { page, limit } = payload;

      // Prepare aggregation pipeline
      const cancellationPipeline: PipelineStage[] = await BookingCancellationAggregation({ payload });

      // Get paginated data
      const cancellations = await BookingCancellationModel.aggregate(cancellationPipeline).exec();

      // Get total after filters (for pagination)
      const countPipeline: PipelineStage[] = [
        ...cancellationPipeline.slice(0, -2), // Remove $skip and $limit for full count
        { $count: 'count' },
      ];
      const counts = await BookingCancellationModel.aggregate(countPipeline).exec();
      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / (limit || 1));

      const response: PaginatedData<BookingCancellation[]> = {
        page,
        limit,
        total,
        data: cancellations,
        pages,
      };

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Booking cancellations loaded successfully',
        data: response,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an error loading booking cancellations',
        data: error,
      });
    }
  }

  /**
   * Get one cancellation by id (with booking + customer).
   */
  async findOne(id: string): Promise<HttpResponseInterface<BookingCancellation>> {
    try {
      // Use consistent payload pattern as in BookingsService
      const totalDocuments = await BookingCancellationModel.countDocuments().exec();
      const payload: BookingCancellationQueryPayload = await getBookingCancellationParams({
        query: {},
        totalDocuments,
      });

      const aggregationPipeline: PipelineStage[] = await BookingCancellationAggregation({
        payload,
        cancellationId: id,
      });

      // Always return a single result
      const results = await BookingCancellationModel.aggregate(aggregationPipeline).exec();
      const cancellation = results[0];

      if (!cancellation) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Booking cancellation with id ${id} not found`,
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Booking cancellation ${id} found`,
        data: cancellation,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error loading booking cancellation ${id}`,
        data: error,
      });
    }
  }
}
