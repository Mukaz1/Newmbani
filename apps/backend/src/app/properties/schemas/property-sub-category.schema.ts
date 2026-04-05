import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, PropertySubCategory } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const PropertySubCategorySchema = new Schema<PropertySubCategory>({
  categoryId: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  icon: { type: String, required: false, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },

  // extend the base schema
  ...BaseSchema.obj,
});

export const PropertySubCategoryModel = model<PropertySubCategory>(
  DatabaseModelEnums.PROPERTY_SUB_CATEGORY,
  PropertySubCategorySchema
);
