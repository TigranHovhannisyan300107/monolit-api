import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisService } from 'src/redis/redis.service';
import { EmitterChannels, EmitterEvents, EventNames } from './enums';

@Injectable()
export class EventEmitterRedisService implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.logger.log(
      'Initializing Event Emitter...',
      EventEmitterRedisService.name,
    );
    
    const subscriber = this.redisService.getSubscriberClient();

    subscriber.on(EmitterEvents.MESSAGE, (channel, message) => {
      this.logger.log(
        `Received message on channel ${channel}: ${message}`,
        EventEmitterRedisService.name,
      );
      const { event, data } = JSON.parse(message);
      this.eventEmitter.emit(event, data);
    });

    await subscriber.subscribe(EmitterChannels.EVENTS);
  }

  emit<T>(event: EventNames, data: T) {
    this.logger.log(`Emitting event: ${event}`, EventEmitterRedisService.name);
    const publisher = this.redisService.getPublisherClient();
    publisher.publish(EmitterChannels.EVENTS, JSON.stringify({ event, data }));
  }

  on<T>(event: EventNames, handler: (data: T) => void) {
    this.logger.log(`Listening event: ${event}`, EventEmitterRedisService.name);
    this.eventEmitter.on(event, handler);
  }
}
