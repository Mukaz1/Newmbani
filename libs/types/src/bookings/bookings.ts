import { AuditData } from '../audit';
import { Property } from '../properties';
import { Customer } from '../customers';
import { BookingStatusEnum } from './enums/bookings-status.enum';
import { Invoice } from '../invoices/invoice';

export interface CreateBooking {
  customerId: string;
  propertyId: string;
  viewingDate: string |Date;
}

export interface PostCreateBooking extends CreateBooking {
  status: BookingStatusEnum;
  createdBy: string;
  createdAt: Date;
}

export interface Booking extends PostCreateBooking, AuditData {
  customer: Customer;
  property: Property;
  invoice?: Invoice | null;
}
