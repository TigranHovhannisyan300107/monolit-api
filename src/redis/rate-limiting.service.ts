import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TooManyRequestsException } from 'src/exceptions/too-many-requests.exception';
import { RedisService } from './redis.service';
import { RateLimitingInterval } from './enums';

@Injectable()
export class RateLimitingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async incrementRequestCountOrThrow(apiKey: string): Promise<number> {
    const rateLimitClient = this.redisService.getRateLimitClient();
    const key = `${RateLimitingInterval.HOURLY}:${apiKey}`;
    const hourlyRequests = await rateLimitClient.incr(key);

    if (hourlyRequests === 1)
      await rateLimitClient.expire(
        key,
        this.configService.get<number>('rateLimit.hourly.expiresIn'),
      );

    if (
      hourlyRequests >
      this.configService.get<number>('rateLimit.hourly.maxRequests')
    )
      throw new TooManyRequestsException('Too many requests in the last hour.');

    return hourlyRequests;
  }

  async checkForRaceCondition(apiKey: string): Promise<void> {
    const rateLimitClient = this.redisService.getRateLimitClient();
    const key = `${RateLimitingInterval.MINUTE}:${apiKey}`;
    const exists = await rateLimitClient.exists(key);

    if (!exists) {
      await rateLimitClient.set(
        key,
        1,
        'EX',
        this.configService.get<number>('rateLimit.minute.expiresIn'),
      );
      return;
    }
    throw new TooManyRequestsException(
      'Only one request is allowed every 5 minutes.',
    );
  }
}
