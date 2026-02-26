import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, Landlord } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const LandlordSchema = new Schema<Landlord>({
  name: { type: String, required: true, unique: true, trim: true },
  displayName: { type: String, required: true, unique: true},
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  acceptTerms: { type: Boolean, required: true, trim: true },
  languages: { type: [String], required: false, trim: true },
  address: { 
    countryId: {type: String, required: true, trim: true},
    county: {type: String, required: true, trim: true},
    town: {type: String, required: false, trim: true},
    street: {type: String, required: false, trim: true},
    building: {type: String, required: false, trim: true}
   },

  // extend the base schema
  ...BaseSchema.obj,
});

export const LandlordModel = model<Landlord>(
  DatabaseModelEnums.LANDLORD,
  LandlordSchema
);