import { model, Schema } from 'mongoose';
import {
  DatabaseModelEnums,
  PropertyImage,
  PropertyImageApprovalStatus,
  } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const PropertyImageSchema = new Schema<PropertyImage>({
  propertyId: { type: String, required: true, trim: true },
  propertyImageCategoryId: { type: String, required: true, trim: true },
  link: { type: String, required: false, trim: true },
  description: { type: String, required: false, trim: true },
  fileId: { type: String, required: false, trim: true },
  approvalStatus: {
    type: String,
    required: true,
    enum: PropertyImageApprovalStatus,
    default: PropertyImageApprovalStatus.PENDING_REVIEW,
  },
  // extend the base schema
  ...BaseSchema.obj,
});

export const PropertyImageModel = model<PropertyImage>(
  DatabaseModelEnums.PROPERTY_IMAGE,
  PropertyImageSchema
);
