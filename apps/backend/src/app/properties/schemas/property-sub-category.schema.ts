import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, PropertiesSubCategory } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const PropertiesSubCategorySchema = new Schema<PropertiesSubCategory>({
  categoryId: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  icon: { type: String, required: false, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },

  // extend the base schema
  ...BaseSchema.obj,
});

export const PropertiesSubCategoryModel = model<PropertiesSubCategory>(
  DatabaseModelEnums.PROPERTY_SUB_CATEGORY,
  PropertiesSubCategorySchema
);
