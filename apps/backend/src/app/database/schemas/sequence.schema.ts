import { DatabaseModelEnums, Sequence } from '@newmbani/types';
import { model, Schema } from 'mongoose';

export const SequenceSchema = new Schema<Sequence>(
  {
    landlords: { type: Number, required: true, default: 0, trim: true },
    tenants: { type: Number, required: true, default: 0, trim: true },
    properties: { type: Number, required: true, default: 0, trim: true },
    bookings: { type: Number, required: true, default: 0, trim: true },
    payments: { type: Number, required: true, default: 0, trim: true },
  },
  { collection: DatabaseModelEnums.SEQUENCE }
);

export const SequenceModel = model(DatabaseModelEnums.SEQUENCE, SequenceSchema);
