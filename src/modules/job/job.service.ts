import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PGDatabaseConnections } from 'src/database/postgres/enums';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job, PGDatabaseConnections.FIRST_PART)
    private readonly jobRepositoryFirstPart: Repository<Job>,
    @InjectRepository(Job, PGDatabaseConnections.SECOND_PART)
    private readonly jobRepositorySecond: Repository<Job>,
    private readonly logger: Logger,
  ) {}

  private getCurrentRepository(): Repository<Job> {
    const currentHourUTC = new Date().getUTCHours();
    return currentHourUTC >= 0 && currentHourUTC < 12
      ? this.jobRepositoryFirstPart
      : this.jobRepositorySecond;
  }

  async createJob(user: string) {
    this.logger.log(`Created job for ${user}`, JobService.name);
    const jobRepository = this.getCurrentRepository();
    return await jobRepository.save({ user });
  }
}
