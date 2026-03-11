import { Injectable } from '@nestjs/common';
import { HttpResponseInterface, HttpStatusCodeEnum, ExpressQuery, BookingStatusEnum } from '@newmbani/types';
import { CustomHttpResponse } from '../../common';
import { BookingModel } from '../schemas/booking.schema';
import { CreateBookingDto, PostCreateBookingDto } from '../dto/bookings.dto';
import { getBookingParams } from '../utils/getBookingsParams';
import { BookingAggregation } from '../queries/bookings.query';
import { PipelineStage } from 'mongoose';

/**
 * Service for handling bookings.
 */
@Injectable()
export class BookingsService {
  /**
   * Create a new booking.
   */
  async create(bookingDto: CreateBookingDto, userId:string): Promise<HttpResponseInterface> {
    try {
      // Enforce PostCreateBooking fields
      const payload: PostCreateBookingDto = {
        ...bookingDto,
        status: BookingStatusEnum.PENDING,
        createdAt: new Date(),
        createdBy: userId
      };

      const booking = await BookingModel.create(payload);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: 'The booking has been created successfully',
        data: booking,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an error creating the booking',
        data: error,
      });
    }
  }

  /**
   * Get all bookings with optional query for pagination, filtering, sorting, etc.
   */
  async findAll(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const totalDocuments = await BookingModel.countDocuments().exec();
      const payload = await getBookingParams({
        query: query || {},
        totalDocuments,
      });

      const { page, limit } = payload;
      const aggregationStages = BookingAggregation({ payload });

      const bookings = await BookingModel.aggregate(aggregationStages as PipelineStage[]).exec();

      // For pagination information: count docs after filters applied
      const countPipeline: PipelineStage[] = [
        ...(aggregationStages.filter(Boolean) as PipelineStage[]),
        { $count: 'count' },
      ];
      const countResults = await BookingModel.aggregate(countPipeline).exec();
      const total = countResults.length > 0 ? countResults[0].count : 0;
      const pages = Math.ceil(total / limit);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Bookings loaded successfully',
        data: { page, limit, total, data: bookings, pages },
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an error loading bookings',
        data: error,
      });
    }
  }

  /**
   * Get a single booking by ID.
   */
  async findOne(id: string): Promise<HttpResponseInterface> {
    try {
      // Setup aggregation to match on bookingId
      const payload = await getBookingParams({
        query: {},
        totalDocuments: 1,
      });

      const aggregationStages = BookingAggregation({ payload, bookingId: id });

      const bookings = await BookingModel.aggregate(aggregationStages as PipelineStage[]).exec();
      const booking = bookings[0];

      if (!booking) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Booking with id ${id} not found`,
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Booking ${id} found`,
        data: booking,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error loading the booking with id ${id}`,
        data: error,
      });
    }
  }

  /**
   * Update a booking.
   */
  async update(id: string, updateDto: Partial<CreateBookingDto>): Promise<HttpResponseInterface> {
    try {
      const updatePayload = {
        ...updateDto,
        updatedAt: new Date(),
      };

      const booking = await BookingModel.findOneAndUpdate(
        { _id: id },
        updatePayload,
        { new: true }
      ).exec();

      if (!booking) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Booking with id ${id} not found`,
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Booking ${id} updated successfully`,
        data: booking,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error updating booking ${id}`,
        data: error,
      });
    }
  }

  /**
   * Remove a booking.
   */
  async remove(id: string): Promise<HttpResponseInterface> {
    try {
      const result = await BookingModel.deleteOne({ _id: id }).exec();

      if (result.deletedCount === 0) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Booking ${id} not found`,
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Booking ${id} removed successfully!`,
        data: null,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Error removing booking ${id}`,
        data: error,
      });
    }
  }
}
