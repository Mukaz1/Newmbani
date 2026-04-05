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
import { HttpResponseInterface, ExpressQuery, UserRequest, PermissionEnum } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { CreateBookingDto, UpdateBookingDto } from '../dto/bookings.dto';
import { BookingsService } from '../services/bookings.service';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Create a new booking.
   */
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.CREATE_BOOKING,
    PermissionEnum.MANAGE_BOOKINGS,
  ])
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GenericResponse() res: GenericResponse,
    @Req() { user }: UserRequest,
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString()
    const response = await this.bookingsService.create(createBookingDto, userId);

    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Get all bookings, with query params for pagination/filtering.
   */
  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_BOOKING,
    PermissionEnum.VIEW_BOOKINGS,
  ])
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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_BOOKING,
    PermissionEnum.VIEW_BOOKINGS,
  ])
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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.UPDATE_BOOKING,
    PermissionEnum.MANAGE_BOOKINGS,
  ])
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.DELETE_BOOKING,
    PermissionEnum.MANAGE_BOOKINGS,
  ])
  async remove(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingsService.remove(id);
    res.setStatus(response.statusCode);
    return response;
  }
}
