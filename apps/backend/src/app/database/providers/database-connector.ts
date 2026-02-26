import { DatabaseModelEnums } from '@newmbani/types';
import * as mongoose from 'mongoose';

/**
 * Database root underwriters that set up the database connection.
 *
 * Exports an array of underwriters that configure the root MongoDB database connection.
 * - Provides the DATABASE_CONNECTION token that contains the Mongoose instance.
 * - Connects to the MongoDB database using credentials from environment variables.
 */
export const databaseConnector = [
  {
    provide: DatabaseModelEnums.DATABASE_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> => {
      return await mongoose.connect(process.env.DATABASE_PATH, {
        dbName: process.env.DATABASE_NAME,
      });
    },
  },
];
