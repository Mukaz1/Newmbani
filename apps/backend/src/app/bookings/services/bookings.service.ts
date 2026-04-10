import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  ExpressQuery,
  BookingStatusEnum,
  Booking,
  PaginatedData,
  SystemEventsEnum,
} from '@newmbani/types';
import { CustomHttpResponse } from '../../common';
import { BookingModel } from '../schemas/booking.schema';
import {
  CreateBookingDto,
  PostCreateBookingDto,
  UpdateBookingDto,
  UpdateBookingStatusDto,
} from '../dto/bookings.dto';
import { BookingQueryPayload, getBookingParams } from '../utils/getBookingsParams';
import { BookingAggregation } from '../queries/bookings.query';
import { PipelineStage } from 'mongoose';
import { UserModel } from '../../auth/schemas/user.schema';

@Injectable()
export class BookingsService {
  constructor(private readonly eventEmitter: EventEmitter2) {} // ✅ inject EventEmitter2

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
          message: 'A booking with the same customer, property, and date already exists.',
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

      // ✅ emit booking created event
      this.eventEmitter.emit(SystemEventsEnum.BookingCreated, bookingResponse.data);

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

      const search: Array<any> = await BookingAggregation({ payload: bookingPayload });
      const bookings: Booking[] = await BookingModel.aggregate(search).exec();

      const counts = await BookingModel.aggregate([
        ...search.slice(0, -2),
        { $count: 'count' },
      ]).exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / bookingPayload.limit);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Bookings loaded successfully',
        data: { page: bookingPayload.page, limit: bookingPayload.limit, total, data: bookings, pages },
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an error loading bookings',
        data: error,
      });
    }
  }

  async findOne(id: string): Promise<HttpResponseInterface<Booking>> {
    try {
      const bookingPayload = {
        keyword: '',
        skip: 0,
        limit: 1,
        page: 1,
        sort: { _id: -1 },
        slim: false,
      };

      const pipeline = BookingAggregation({ payload: bookingPayload, bookingId: id });
      const bookings = await BookingModel.aggregate(pipeline as PipelineStage[]).exec();
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
          message: 'A booking for this property with the same date already exists.',
        });
      }

      await BookingModel.findOneAndUpdate(
        { _id: id },
        { ...updateDto, updatedAt: new Date() },
        { new: true },
      ).exec();

      const updatedBooking = (await this.findOne(id)).data;
      if (!updatedBooking) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `Booking with id ${id} not found`,
          data: null,
        });
      }

      // ✅ emit booking updated event
      this.eventEmitter.emit(SystemEventsEnum.BookingUpdated, updatedBooking);

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
    await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      { status: statusDto.status, updatedAt: new Date() },
      { new: true },
    ).exec();

    // ✅ fetch the full populated booking so emails have customer/property data
    const bookingResponse = await this.findOne(bookingId);
    const booking = bookingResponse.data;

    if (!booking) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.NOT_FOUND,
        message: `Booking with id ${bookingId} not found`,
        data: null,
      });
    }

    // ✅ emit specific event based on new status
    const statusEventMap: Partial<Record<BookingStatusEnum, string>> = {
      [BookingStatusEnum.APPROVED]: SystemEventsEnum.BookingApproved,
      [BookingStatusEnum.REJECTED]: SystemEventsEnum.BookingRejected,
      [BookingStatusEnum.CANCELLED]: SystemEventsEnum.BookingCancelled,
    };

    const event = statusEventMap[statusDto.status];
    if (event) this.eventEmitter.emit(event, booking);

    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message: `Booking status updated`,
      data: booking,
    });
  }

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