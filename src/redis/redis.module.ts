import { Module, Global, Logger } from '@nestjs/common';
import redisProviders from './redis.provider';

@Global()
@Module({
  providers: [...redisProviders, Logger],
  exports: [...redisProviders, Logger],
})
export class RedisModule {}
