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
import { HttpResponseInterface, ExpressQuery } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { CreateBookingDto } from '../dto/bookings.dto';
import { BookingsService } from '../services/bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create a new booking.
   */
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingsService.create(createBookingDto);

    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Get all bookings, with query params for pagination/filtering.
   */
  @Get()
  async findAll(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingsService.findAll(query);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Get a booking by id.
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingsService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Update a booking by id.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: Partial<CreateBookingDto>,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingsService.update(id, updateBookingDto);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Remove a booking by id.
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingsService.remove(id);
    res.setStatus(response.statusCode);
    return response;
  }
}
