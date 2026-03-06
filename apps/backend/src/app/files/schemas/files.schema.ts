import { model, Schema } from 'mongoose';
import { DatabaseModelEnums, FileInterface } from '@newmbani/types';
import { BaseSchema } from '../../database/schemas/base.schema';

export const FilesSchema = new Schema<FileInterface>(
  {
    name: { type: String, required: true, trim: true },
    file: {
      type: Object,
      required: false,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    // Extend Base Schema
    ...BaseSchema.obj,
  },
  {
    collection: DatabaseModelEnums.FILE,
  }
);

export const FilesModel = model(DatabaseModelEnums.FILE, FilesSchema);
