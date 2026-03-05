import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './services/redis.service';
import { RedisRepositoryService } from './repositories/redis.repository';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    RedisService,
    RedisRepositoryService,
    {
      provide: 'RedisBackOfficeUser',
      useFactory: () => {
        const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
        return new Redis(url);
      },
    },
  ],
  exports: [RedisService, RedisRepositoryService, 'RedisBackOfficeUser'],
})
export class RedisModule {}
