import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, PropertyImageCategory } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const PropertyImageCategorySchema = new Schema<PropertyImageCategory>({
  name: { type: String, required: true, unique: true, trim: true },
  maxNumber: { type: Number, required: true, trim: true },
  minNumber: { type: Number, required: true, trim: true },
  maxFileSize: { type: Number, required: false, trim: true },

  ...BaseSchema.obj,
});

export const PropertyImageCategoryModel = model<PropertyImageCategory>(
  DatabaseModelEnums.PROPERTY_IMAGE_CATEGORY,
  PropertyImageCategorySchema
);
