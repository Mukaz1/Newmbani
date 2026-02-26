import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, Role } from '@newmbani/types';
import { PlainBaseSchema } from '../../database/schemas/base.schema';

export const RolesSchema = new Schema<Role>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  permissions: { type: [String], required: true, default: [], trim: true },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  ...PlainBaseSchema.obj,
});

export const RoleModel = model(
  DatabaseModelEnums.ROLE,
  RolesSchema,
  DatabaseModelEnums.ROLE,
);
