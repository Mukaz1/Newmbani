import { model, Schema } from 'mongoose';
import { Country, DatabaseModelEnums } from '@newmbani/types';
import { PlainBaseSchema } from '../../database/schemas/base.schema';

export const CountrySchema = new Schema<Country>(
  {
    name: { type: String, required: true, sparse: true, trim: true },
    code: {
      type: String,
      required: true,
      sparse: true,
      trim: true,
      unique: true,
    },
    supported: {
      type: Boolean,
      required: true,
      sparse: true,
      trim: true,
      default: false,
    },
    mobileCode: {
      type: String,
      required: true,
      sparse: true,
      trim: true,
    },
    taxRate: {
      type: Number,
      required: true,
      sparse: true,
      trim: true,
      default: 0,
    },

    commissionRates: {
      service: {
        rate: { type: Number, required: true, default: 0 },
        currencyId: { type: String, required: false, sparse: true, trim: true },
        isPercentage: { type: Boolean, required: true, default: false },
      },

      property: {
        rate: { type: Number, required: true, default: 0 },
        currencyId: { type: String, required: false, sparse: true, trim: true },
        isPercentage: { type: Boolean, required: true, default: false },
      },
    },
    supporting: {
      landlord: { type: Boolean, required: true, default: false },
      customer: { type: Boolean, required: true, default: false },
    },
    // Extend Base Schema
    ...PlainBaseSchema.obj,
  },
  {
    collection: DatabaseModelEnums.COUNTRY,
  }
);

export const CountryModel = model<Country>(
  DatabaseModelEnums.COUNTRY,
  CountrySchema
);
