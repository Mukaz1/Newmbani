import { Inject, Injectable } from '@nestjs/common';
import { RedisRepositoryService } from '../repositories/redis.repository';
import { RedisPrefixEnum } from '../enums/redis-prefix.enum';

const oneDayInSeconds = 60 * 60 * 24;
const tenMinutesInSeconds = 60 * 10;

export class InvalidatedRefreshTokenError extends Error {
  //
}

@Injectable()
export class RedisService {
  /**
   * Creates an instance of RedisService.
   * @param {RedisRepository} redisRepository
   * @memberof RedisService
   */
  constructor(
    @Inject(RedisRepositoryService)
    private readonly redisRepository: RedisRepositoryService
  ) {}

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    // Expiry is set to 1 day
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.USER,
      userId,
      JSON.stringify(token),
      oneDayInSeconds * 30
    );
  }

  async getRefreshToken(userId: string): Promise<any | null> {
    const user = await this.redisRepository.get(RedisPrefixEnum.USER, userId);
    return JSON.parse(user);
  }

  async validateRefreshToken(userId: string, tokenId: string) {
    const storedId = await this.getRefreshToken(userId);
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisRepository.delete(RedisPrefixEnum.USER, userId);
  }

  async saveResetToken(userId: string, token: string): Promise<void> {
    // Expiry is set to 10 minutes
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.USER,
      token,
      userId,
      tenMinutesInSeconds
    );
  }

  async getResetToken(token: string): Promise<string | null> {
    return await this.redisRepository.get(RedisPrefixEnum.USER, token);
  }

  async setKeyWithExpiry(payload: {
    prefix: string,
    key: string;
    value: string;
    expiriesIn: number;
  }) {
    return await this.redisRepository.setWithExpiry(
      payload.prefix,
      payload.key,
      payload.value,
      payload.expiriesIn
    );
  }

  async get(payload:{prefix: string,key: string}): Promise<any | null> {
    const result = await this.redisRepository.get(payload.prefix, payload.key);
    return result
  }

  async delete(payload:{prefix: string,key: string}): Promise<void> {
    await this.redisRepository.delete(payload.prefix, payload.key);
    return 
  }
}
