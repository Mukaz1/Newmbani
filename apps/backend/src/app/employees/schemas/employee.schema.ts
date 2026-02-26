import { Employee, DatabaseModelEnums } from '@newmbani/types';
import { model, Schema } from 'mongoose';

export const EmployeeSchema = new Schema<Employee>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true, unique: true },
    isActive: { type: Boolean, required: true, default: true, trim: true },
    roleId: {
      type: String,
      required: false,
      trim: true,
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
  },
  { collection: DatabaseModelEnums.EMPLOYEE },
);

export const EmployeeModel = model<Employee>(
  DatabaseModelEnums.EMPLOYEE,
  EmployeeSchema,
);
