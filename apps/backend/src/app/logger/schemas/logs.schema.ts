import { DatabaseModelEnums } from '@newmbani/types';
import { model, Schema } from 'mongoose';

export const LogsSchema = new Schema({
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
    required: false,
    default: null,
    trim: true,
  },
  method: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
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

export const LogsModel = model(DatabaseModelEnums.LOG, LogsSchema);
