import { DatabaseModelEnums } from '@newmbani/types';
import { FilesModel } from './schemas/files.schema';

export const fileManagerProviders = [
  {
    provide: DatabaseModelEnums.FILE,
    useFactory: () => FilesModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
