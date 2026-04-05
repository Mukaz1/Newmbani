import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ExpressQuery,
  HttpResponseInterface,
  PermissionEnum,
  UserRequest,
} from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { CreateBookingCancellationDto } from '../dto/booking-cancellations.dto';
import { BookingCancellationsService } from '../services/booking-cancellations.service';

@Controller('booking-cancellations')
export class BookingCancellationsController {
  constructor(
    private readonly bookingCancellationsService: BookingCancellationsService,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.CREATE_BOOKING_CANCELLATION,
    PermissionEnum.MANAGE_BOOKING_CANCELLATIONS,
    PermissionEnum.MANAGE_BOOKINGS,
  ])
  async create(
    @Body() dto: CreateBookingCancellationDto,
    @GenericResponse() res: GenericResponse,
    @Req() { user }: UserRequest,
  ): Promise<HttpResponseInterface> {
    const userId = user._id.toString();
    const response = await this.bookingCancellationsService.create(dto, userId);
    res.setStatus(response.statusCode);
    return response;
  }

  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_BOOKING_CANCELLATIONS,
    PermissionEnum.MANAGE_BOOKING_CANCELLATIONS,
    PermissionEnum.MANAGE_BOOKINGS,
  ])
  async findAll(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingCancellationsService.findAll(query);
    res.setStatus(response.statusCode);
    return response;
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_BOOKING_CANCELLATION,
    PermissionEnum.MANAGE_BOOKING_CANCELLATIONS,
    PermissionEnum.MANAGE_BOOKINGS,
  ])
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const response = await this.bookingCancellationsService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }
}
