import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, User } from '@newmbani/types';

export const UserSchema = new Schema<User>({
  name: { type: String, required: true, trim: true },
  // email
  email: { type: String, required: true, trim: true, unique: true },
  emailVerified: {
    required: true,
    type: Boolean,
    default: false,
    trim: true,
  },

  magicLogin: {
    required: true,
    type: Boolean,
    default: true,
    trim: true,
  },

  // phone
  phone: { type: String, required: true, trim: true, unique: true },
  phoneVerified: {
    required: true,
    type: Boolean,
    default: false,
    trim: true,
  },
  profileImageUrl: { type: String, required: false, trim: true },
  fileId: { type: String, required: false, trim: true },
  verified: {
    required: true,
    type: Boolean,
    default: false,
    trim: true,
  },

  customerId: { required: false, type: String, trim: true, default: null },
  landlordId: { required: false, type: String, trim: true, default: null },
  defaultAddress: {
    countryId: { type: String, required: false, trim: true },
    county: { type: String, required: false, trim: true },
    town: { type: String, required: false, trim: true },
    street: { type: String, required: false, trim: true },
    building: { type: String, required: false, trim: true },
  },
  password: { type: String, required: true, trim: true },

  isActive: { type: Boolean, required: true, default: true, trim: true },

  isPasswordDefault: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  twoFactorEnabled: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },

  roleId: {
    type: String,
    required: false,
    trim: true,
  },

  employeeId: {
    type: String,
    required: false,
    trim: true,
  },

  createdBy: {
    type: String,
    required: false,
    trim: true,
  },
  updatedBy: {
    type: String,
    required: false,
    trim: true,
  },
  deletedBy: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    trim: true,
  },
  lastPasswordChange: {
    type: Date,
    required: true,
    default: Date.now,
    trim: true,
  },
  updatedAt: {
    type: Date,
    required: false,
    trim: true,
  },
  deletedAt: {
    type: Date,
    required: false,
    trim: true,
  },
});

export const UserModel = model<User>(DatabaseModelEnums.USER, UserSchema);
