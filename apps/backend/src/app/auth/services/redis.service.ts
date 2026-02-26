import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    onModuleInit() {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            throw new Error('REDIS_URL environment variable is not set');
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
