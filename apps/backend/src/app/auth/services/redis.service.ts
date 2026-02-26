import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl =
      this.configService.get<string>('REDIS_URL') || process.env.REDIS_URL;

    if (!redisUrl) {
      // In production we want to fail fast. In development, skip Redis initialization.
      if (process.env.NODE_ENV === 'production') {
        throw new Error('REDIS_URL environment variable is not set');
      }

      console.warn(
        '⚠️  REDIS_URL not set — skipping Redis client initialization (development mode)',
      );
      return;
    }

    this.client = new Redis(redisUrl);

    this.client.on('connect', () => console.log('✅ Redis Connected'));
    this.client.on('error', (err) => console.error('❌ Redis error:', err));
  }

  onModuleDestroy() {
    if (this.client) this.client.quit();
  }

  private getKey(email: string): string {
    return `refresh:${email}`;
  }

  async setRefreshToken(email: string, token: string): Promise<void> {
    await this.client.set(this.getKey(email), token, 'EX', 7 * 24 * 60 * 60);
  }

  async getRefreshToken(email: string): Promise<string | null> {
    return this.client.get(this.getKey(email));
  }

  async deleteRefreshToken(email: string): Promise<void> {
    await this.client.del(this.getKey(email));
  }
}
