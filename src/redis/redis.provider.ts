import Redis, { Redis as RedisClient } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import { RedisNamespaces } from './enums';
import { RedisService } from './redis.service';
import { RateLimitingService } from './rate-limiting.service';

const redisProviders: Provider[] = [
  {
    provide: RedisNamespaces.SUBSCRIBER,
    useFactory: (configService: ConfigService): RedisClient =>
      new Redis({
        username: configService.get<string>('redis.username'),
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        password: configService.get<string>('redis.password'),
        db: configService.get<number>('redis.pubSubDB'),
        keyPrefix: RedisNamespaces.SUBSCRIBER,
      }),
    inject: [ConfigService],
  },
  {
    provide: RedisNamespaces.PUBLISHER,
    useFactory: (configService: ConfigService): RedisClient =>
      new Redis({
        username: configService.get<string>('redis.username'),
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        password: configService.get<string>('redis.password'),
        db: configService.get<number>('redis.pubSubDB'),
        keyPrefix: RedisNamespaces.PUBLISHER,
      }),
    inject: [ConfigService],
  },
  {
    provide: RedisNamespaces.RATE_LIMIT,
    useFactory: (configService: ConfigService): RedisClient =>
      new Redis({
        username: configService.get<string>('redis.username'),
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        password: configService.get<string>('redis.password'),
        db: configService.get<number>('redis.rateLimitDB'),
        keyPrefix: RedisNamespaces.RATE_LIMIT,
      }),
    inject: [ConfigService],
  },
  RedisService,
  RateLimitingService,
];

export default redisProviders;
