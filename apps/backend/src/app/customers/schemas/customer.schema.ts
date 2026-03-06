import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, Customer } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const CustomerSchema = new Schema<Customer>({
  name: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  acceptTerms: { type: Boolean, required: true, trim: true },
  address: {
    countryId: { type: String, required: true, trim: true },
    county: { type: String, required: true, trim: true },
    town: { type: String, required: false, trim: true },
    street: { type: String, required: false, trim: true },
    building: { type: String, required: false, trim: true },
  },

  // extend the base schema
  ...BaseSchema.obj,
});

export const CustomerModel = model<Customer>(
  DatabaseModelEnums.CUSTOMER,
  CustomerSchema,
);
