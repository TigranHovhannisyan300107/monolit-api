import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';
import { RedisNamespaces } from './enums';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  constructor(
    private readonly logger: Logger,
    @Inject(RedisNamespaces.SUBSCRIBER)
    private readonly subscriberClient: RedisClient,
    @Inject(RedisNamespaces.PUBLISHER)
    private readonly publisherClient: RedisClient,
    @Inject(RedisNamespaces.RATE_LIMIT)
    private readonly rateLimitClient: RedisClient,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing RedisService...', RedisService.name);
  }

  getSubscriberClient(): RedisClient {
    return this.subscriberClient;
  }

  getPublisherClient(): RedisClient {
    return this.publisherClient;
  }

  getRateLimitClient(): RedisClient {
    return this.rateLimitClient;
  }

  async onModuleDestroy() {
    await this.subscriberClient.quit();
    await this.publisherClient.quit();
    await this.rateLimitClient.quit();
  }
}
