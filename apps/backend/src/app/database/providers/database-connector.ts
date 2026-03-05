import { DatabaseModelEnums } from '@newmbani/types';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';

const logger = new Logger('DatabaseConnector');

/**
 * Database root provider that sets up the database connection.
 *
 * - Reads `process.env.DATABASE_PATH` (or `MONGODB_URL`) and `DATABASE_NAME`.
 * - Falls back to a local MongoDB URL for development when env is not provided.
 * - Performs a small retry loop so transient network issues don't immediately crash the process.
 */
export const databaseConnector = [
  {
    provide: DatabaseModelEnums.DATABASE_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> => {
      const url = process.env.DATABASE_PATH || 'mongodb://127.0.0.1:27017';
      const dbName = process.env.DATABASE_NAME || 'newmbani';

      const maxAttempts = 5;
      const retryDelayMs = 2000;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          logger.log(
            `Connecting to MongoDB (attempt ${attempt}) ${url} db=${dbName}`,
          );
          const conn = await mongoose.connect(url, {
            dbName,
            // keep timeouts modest so devs don't wait too long
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
          } as mongoose.ConnectOptions);

          logger.log('Connected to MongoDB');
          return conn;
        } catch (err) {
          logger.warn(
            `MongoDB connection attempt ${attempt} failed: ${
              (err as Error).message || err
            }`,
          );

          if (attempt < maxAttempts) {
            // exponential backoff with cap
            const delay = Math.min(retryDelayMs * attempt, 10000);
            await new Promise((res) => setTimeout(res, delay));
            continue;
          }

          // Final failure: log and continue without throwing so the app won't crash immediately in dev.
          logger.error(
            `Could not connect to MongoDB after ${maxAttempts} attempts. Continuing without DB connection.`,
          );
          return mongoose;
        }
      }

      // Fallback (shouldn't be reached)
      return mongoose;
    },
  },
];
