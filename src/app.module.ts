import { Logger, Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { EventModule } from './modules/event/event.module';
import { RedisModule } from './redis/redis.module';
import { RateLimitingGuard } from './guards/rate-limiting.guard';
import { RateLimitingService } from './redis/rate-limiting.service';
import { JobModule } from './modules/job/job.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { DbModule } from './database/db.module';
import { JobSnapshotModule } from './modules/job-snapshot/job-snapshot.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AppConfigModule,
    DbModule,
    EventModule,
    RedisModule,
    JobModule,
    ApiKeyModule,
    JobSnapshotModule,
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'MONOLITH-API',
        autoLogging: false,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
  ],
  providers: [Logger, RateLimitingGuard, RateLimitingService],
})
export class AppModule {}
