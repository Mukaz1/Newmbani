import { Injectable } from '@nestjs/common';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  ExpressQuery,
  BookingStatusEnum,
  Booking,
  PaginatedData,
} from '@newmbani/types';
import { CustomHttpResponse } from '../../common';
import { BookingModel } from '../schemas/booking.schema';
import {
  CreateBookingDto,
  PostCreateBookingDto,
  UpdateBookingDto,
  UpdateBookingStatusDto,
} from '../dto/bookings.dto';
import {
  BookingQueryPayload,
  getBookingParams,
} from '../utils/getBookingsParams';
import { BookingAggregation } from '../queries/bookings.query';
import { PipelineStage } from 'mongoose';
import { UserModel } from '../../auth/schemas/user.schema';

/**
 * Service for handling bookings.
 */
@Injectable()
export class BookingsService {
  /**
   * Create a new booking.
   */
  async create(
    bookingDto: CreateBookingDto,
    userId: string,
  ): Promise<HttpResponseInterface<Booking>> {
    try {
      const duplicate = await BookingModel.findOne({
        customerId: bookingDto.customerId,
        propertyId: bookingDto.propertyId,
        viewingDate: bookingDto.viewingDate,
      });

      if (duplicate) {
        return new CustomHttpResponse({
          data: null,
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message:
            'A booking with the same customer, property, and date already exists.',
        });
      }

      const payload: PostCreateBookingDto = {
        ...bookingDto,
        status: BookingStatusEnum.PENDING,
        createdAt: new Date(),
        createdBy: userId,
      };

      const created = await BookingModel.create(payload);

      const bookingResponse = await this.findOne(created._id.toString());

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: 'The booking has been created successfully',
        data: bookingResponse.data ?? null,
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
  async findAll(
    query?: ExpressQuery,
    userId?: string,
  ): Promise<HttpResponseInterface<PaginatedData<Booking[]>>> {
    try {
      const totalDocuments = await BookingModel.find().countDocuments().exec();
      const bookingPayload: BookingQueryPayload = await getBookingParams({
        query: query || {},
        totalDocuments,
      });

      if (userId) {
        const user = await UserModel.findById(userId).exec();

        if (user) {
          if (user.customerId) {
            bookingPayload.customerId = user.customerId.toString();
          } else if (user.landlordId) {
            bookingPayload.landlordId = user.landlordId.toString();
          }
        }
      }

      const search: Array<any> = await BookingAggregation({
        payload: bookingPayload,
      });

      const bookings: Booking[] = await BookingModel.aggregate(search).exec();

      const counts = await BookingModel.aggregate([
        ...search.slice(0, -2),
        { $count: 'count' },
      ]).exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / bookingPayload.limit);

      const response: PaginatedData<Booking[]> = {
        page: bookingPayload.page,
        limit: bookingPayload.limit,
        total,
        data: bookings,
        pages,
      };

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Bookings loaded successfully',
        data: response,
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
  async findOne(id: string): Promise<HttpResponseInterface<Booking>> {
    try {
      // Use a default sort key to avoid MongoDB error when sort is empty
      const bookingPayload = {
        keyword: '',
        skip: 0,
        limit: 1,
        page: 1,
        sort: { _id: -1 }, // Ensures at least one sort key is present
        slim: false,
      };

      // Get the aggregation pipeline with bookingId
      const pipeline = BookingAggregation({
        payload: bookingPayload,
        bookingId: id,
      });

      // Execute the aggregation pipeline
      const bookings = await BookingModel.aggregate(
        pipeline as PipelineStage[],
      ).exec();
      const booking = bookings[0];

      if (booking) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.OK,
          message: `Booking ${id} found`,
          data: booking,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.NOT_FOUND,
        message: `Booking with id ${id} not found`,
        data: null,
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
  async update(
    id: string,
    updateDto: UpdateBookingDto,
  ): Promise<HttpResponseInterface<Booking>> {
    try {
      const booking = await BookingModel.findOne({ _id: id });

      const duplicate = await BookingModel.findOne({
        customerId: booking.customerId,
        propertyId: booking.propertyId,
        viewingDate: updateDto.viewingDate,
      });

      if (duplicate) {
        return new CustomHttpResponse({
          data: null,
          statusCode: HttpStatusCodeEnum.BAD_REQUEST,
          message:
            'A booking for this property with the same date already exists.',
        });
      }

      const updatePayload = {
        ...updateDto,
        updatedAt: new Date(),
      };

      await BookingModel.findOneAndUpdate({ _id: id }, updatePayload, {
        new: true,
      }).exec();

      const updatedBooking = (await this.findOne(id)).data;
      if (!updatedBooking) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Booking with id ${id} not found`,
          data: null,
        });
      }

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Booking ${id} updated successfully`,
        data: updatedBooking,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error updating booking ${id}`,
        data: error,
      });
    }
  }

  async updateBookingStatus(
    bookingId: string,
    statusDto: UpdateBookingStatusDto,
  ): Promise<HttpResponseInterface<Booking>> {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      { status: statusDto.status, updatedAt: new Date() },
      { new: true },
    ).exec();
    if (!booking) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.NOT_FOUND,
        message: `Booking with id ${bookingId} not found`,
        data: null,
      });
    }
    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message: `Booking status updated`,
      data: booking,
    });
  }

  /**
   * Remove a booking.
   */
  async remove(id: string): Promise<HttpResponseInterface<null>> {
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
