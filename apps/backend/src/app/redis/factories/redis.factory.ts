import { FactoryProvider, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { GenerateRedisURL } from '../helpers/redis-url.helper';
import * as redisDefaultProps from '../../queues/config/queues.config';
const logger = new Logger('RedisClientUserFactory');

export const RedisClientUserFactory: FactoryProvider<Redis> = {
  provide: 'RedisBackOfficeUser',
  useFactory: () => {
    const REDIS_URL = GenerateRedisURL();
    const redisProps: any = redisDefaultProps as any;
    delete redisProps.redis;
    const redisInstance = new Redis(REDIS_URL);
    redisInstance.on('connecting', () => {
      logger.log('Connecting to Redis.');
    });
    redisInstance.on('connect', () => {
      logger.log('Success! Redis connection established.');
    });
    redisInstance.on('error', (err: any) => {
      logger.error({ err });
      if (err.code === 'ECONNREFUSED') {
        logger.warn(`Could not connect to Redis: ${err.message}.`);
      } else if (err.name === 'MaxRetriesPerRequestError') {
        logger.error(`Critical Redis error: ${err.message}. Shutting down.`);
        process.exit(1);
      } else {
        logger.error(`Redis encountered an error: ${err.message}.`);
      }
    });
    return redisInstance;
  },
  inject: [],
};
