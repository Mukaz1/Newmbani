import { AuditData } from '../common/audit-data';
import { Customer } from '../customers';
import { Booking } from './bookings';

export interface CancelBooking {
  customerId: string;
  bookingId: string;
  reason: string;
}

export interface PostCancelBooking extends CancelBooking {
  createdBy: string;
  createdAt: Date;
}

export interface BookingCancellation extends AuditData, PostCancelBooking {
  booking: Booking;
  customer: Customer;
}