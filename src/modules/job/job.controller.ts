import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RateLimitingGuard } from 'src/guards/rate-limiting.guard';
import { RequestWithUser } from 'src/types';
import { JobService } from './job.service';
import { EventEmitterRedisService } from '../event/event-emitter-redis.service';
import { EventNames } from '../event/enums';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly eventEmitter: EventEmitterRedisService,
  ) {}

  @Post()
  @UseGuards(ApiKeyGuard, RateLimitingGuard)
  async createJob(@Req() { user }: RequestWithUser) {
    const job = await this.jobService.createJob(user);
    this.eventEmitter.emit(EventNames.JOB_STARTED, job);
  }
}
