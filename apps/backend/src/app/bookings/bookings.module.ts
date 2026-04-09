import { Module } from '@nestjs/common';
import { BookingCancellationsController } from './controllers/booking-cancellations.controller';
import { BookingsController } from './controllers/bookings.controller';
import { BookingCancellationsService } from './services/booking-cancellations.service';
import { BookingsService } from './services/bookings.service';
import { BookingAutomationService } from './services/booking-automation.service';

@Module({
  providers: [
    BookingsService,
    BookingCancellationsService,
    BookingAutomationService,
  ],
  controllers: [BookingsController, BookingCancellationsController],
  exports: [BookingsService, BookingCancellationsService],
})
export class BookingsModule {}
