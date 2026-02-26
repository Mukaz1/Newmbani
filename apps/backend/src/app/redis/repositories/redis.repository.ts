import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisRepository } from '../redis.repository';

@Injectable()
export class RedisRepositoryService
  implements OnModuleDestroy, RedisRepository
{
  /**
   * Creates an instance of RedisRepository.
   * @param {Redis} redisBackOfficeUser
   * @memberof RedisRepository
   */
  constructor(
    @Inject('RedisBackOfficeUser') private readonly redisBackOfficeUser: Redis
  ) {}

  onModuleDestroy(): void {
    this.redisBackOfficeUser.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisBackOfficeUser.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisBackOfficeUser.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisBackOfficeUser.del(`${prefix}:${key}`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number
  ): Promise<void> {
    await this.redisBackOfficeUser.set(`${prefix}:${key}`, value, 'EX', expiry);
  }
}
