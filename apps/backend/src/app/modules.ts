import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { eventEmitterConfig } from './events/configs/events.config';
import { RedisModule } from './redis/redis.module';
import { generatePassword } from './common';

export const DefaultModules = [
  ConfigModule.forRoot({ isGlobal: true }),
  ThrottlerModule.forRoot([
    { name: 'short', ttl: 1000, limit: 10 },
    { name: 'long', ttl: 60000, limit: 100 },
  ]),
  ScheduleModule.forRoot(),
  EventEmitterModule.forRoot(eventEmitterConfig),

  // Initialize Bull module
  BullModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      redis: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: JSON.parse(configService.get('REDIS_HAS_PASSWORD'))
          ? configService.get<string>('REDIS_USERNAME')
          : '',
        password: JSON.parse(configService.get<string>('REDIS_HAS_PASSWORD'))
          ? configService.get<string>('REDIS_PASSWORD')
          : '',
      },
    }),
    inject: [ConfigService],
  }),
  HttpModule.registerAsync({
    useFactory: () => ({
      timeout: 5000,
      maxRedirects: 5,
    }),
  }),
  RedisModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret:
        configService.get('JWT_ACCESS_TOKEN_SECRET') ||
        generatePassword({ length: 20, includeSpecialChars: true }),
      signOptions: {
        expiresIn: configService.get('AUTH_TOKEN_EXPIRY') || '12h',
      },
    }),
    inject: [ConfigService],
  }),
];
