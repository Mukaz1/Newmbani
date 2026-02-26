import { model, Schema } from 'mongoose';
import { DatabaseModelEnums } from '@newmbani/types';

export const AuthLogsSchema = new Schema({
  userId: {
    type: String,
    required: false,
    trim: true,
  },
  ip: {
    type: String,
    required: true,
    trim: true,
  },
  userAgent: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: false,
    trim: true,
  },
  loginSuccess: {
    type: Boolean,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    trim: true,
  },
});

export const AuthLogsModel = model(DatabaseModelEnums.AUTH_LOG, AuthLogsSchema);
