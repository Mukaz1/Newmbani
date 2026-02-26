import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, PropertyCategory } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const PropertyCategorySchema = new Schema<PropertyCategory>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: false, trim: true },
  icon: { type: String, required: false, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },

  // extend the base schema
  ...BaseSchema.obj,
});

export const PropertyCategoryModel = model<PropertyCategory>(
  DatabaseModelEnums.PROPERTY_CATEGORY,
  PropertyCategorySchema
);
