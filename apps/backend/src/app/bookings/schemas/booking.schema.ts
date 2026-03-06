import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, Booking } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const BookingSchema = new Schema<Booking>({
  customerId: { type: String, required: true, unique: true, trim: true },
  propertyId: { type: String, required: true, unique: true },
  viewingDate: { type: String, required: true, trim: true },
  
  // extend the base schema
  ...BaseSchema.obj,
});

export const BookingModel = model<Booking>(
  DatabaseModelEnums.BOOKING,
  BookingSchema,
);
