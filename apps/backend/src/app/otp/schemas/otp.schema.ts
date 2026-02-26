import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, OTP } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const OTPSchema = new Schema<OTP>({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    required: false,
    type: String,
    trim: true,
    sparse: true,
  },
  email: {
    required: false,
    type: String,
    trim: true,
    sparse: true,
  },
  token: {
    required: false,
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  use: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  expiry: {
    type: Number,
    required: false,
  },

  // Extend Base Schema
  ...BaseSchema.obj,
});

export const OTPModel = model<OTP>(DatabaseModelEnums.OTP, OTPSchema);
