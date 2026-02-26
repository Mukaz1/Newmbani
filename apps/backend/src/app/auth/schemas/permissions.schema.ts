import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, Permission } from '@newmbani/types';

export const PermissionsSchema = new Schema<Permission>({
  name: { type: String, required: true, trim: true, unique: true },
  category: { type: String, required: true, trim: true },
});

export const PermissionModel = model(
  DatabaseModelEnums.PERMISSION,
  PermissionsSchema,
  DatabaseModelEnums.PERMISSION,
);
