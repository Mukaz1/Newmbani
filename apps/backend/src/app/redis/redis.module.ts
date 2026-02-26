import { Global, Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { RedisClientUserFactory } from './factories/redis.factory';
import { RedisRepositoryService } from './repositories/redis.repository';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [RedisClientUserFactory, RedisRepositoryService, RedisService],
  exports: [RedisService, RedisRepositoryService],
})
export class RedisModule {}
