import { model, Schema } from 'mongoose';
import { BookingCancellation, DatabaseModelEnums, } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const BookingCancellationSchema = new Schema<BookingCancellation>(
  {
    customerId: { type: String, required: true, trim: true, index: true },
    bookingId: { type: String, required: true, trim: true, unique: true },
    reason: { type: String, required: true, trim: true },
    ...BaseSchema.obj,
  },
  { timestamps: false },
);

export const BookingCancellationModel = model<BookingCancellation>(
  DatabaseModelEnums.BOOKING_CANCELLATION,
  BookingCancellationSchema,
);

