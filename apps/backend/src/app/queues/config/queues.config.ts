import { GenerateRedisURL } from '../../redis/helpers/redis-url.helper';

const REDIS_URL = GenerateRedisURL();

export default {
  redis: REDIS_URL,
  prefix: '',
  maxRetriesPerRequest: null,
  lazyConnect: true,
  tls: {},
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
};
