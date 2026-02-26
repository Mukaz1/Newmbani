import { DatabaseModelEnums } from '@newmbani/types';
import { SequenceModel } from '../schemas/sequence.schema';

export const databaseProviders = [
  {
    provide: DatabaseModelEnums.SEQUENCE,
    useFactory: () => SequenceModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
