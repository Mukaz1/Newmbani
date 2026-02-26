import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, Settings } from '@newmbani/types';

export const SettingSchema = new Schema<Settings>({
  general: {
    app: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    KRA: { type: String, required: true, trim: true, uppercase: true },
    address: {
      boxAddress: { type: String, required: true, trim: true },
      town: { type: String, required: true, trim: true },
      building: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
  },
  facebookApp: {
    FACEBOOK_APP_ID: { type: String, required: false, trim: true },
    FACEBOOK_APP_SECRET: { type: String, required: false, trim: true },
    FACEBOOK_RECIPIENT_WAID: { type: String, required: false, trim: true },
    FACEBOOK_VERSION: { type: String, required: false, trim: true },
    FACEBOOK_PHONE_NUMBER_ID: { type: String, required: false, trim: true },
    FACEBOOK_ACCESS_TOKEN: { type: String, required: false, trim: true },
  },
  mail: {
    port: { type: Number, required: true, default: 465, trim: true },
    auth: {
      user: { type: String, required: true, trim: true },
      pass: { type: String, required: true, trim: true },
    },
    host: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true },
  },
  branding: {
    logo: { type: String, required: false, trim: true, default: null },
    logoFile: { type: Object, required: false, trim: true, default: null },
    darkLogo: { type: String, required: false, trim: true, default: null },
    favicon: { type: String, required: false, trim: true, default: null },
  },

  appURL: { type: String, required: true, trim: true },
  balanceBroughtForwardDate: {
    type: Date,
    required: false,
    trim: true,
  },

  vatRate: {
    type: Number,
    required: true,
    default: 18,
  },

  storage: {
    type: Object,
    required: false,
    trim: true,
    sparse: true,
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

export const SettingsModel = model<Settings>(
  DatabaseModelEnums.SETTING,
  SettingSchema,
);
