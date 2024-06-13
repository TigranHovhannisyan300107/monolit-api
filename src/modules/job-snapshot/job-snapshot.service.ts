import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventNames } from '../event/enums';
import { InjectModel } from '@nestjs/mongoose';
import { JobSnapshot } from './schemas/job-snapshot.schema';
import { Model } from 'mongoose';
import { JobCreatedDto } from './dto/job-snapshot.dto';

@Injectable()
export class JobSnapshotService {
  constructor(
    @InjectModel(JobSnapshot.name)
    private readonly jobSnapshotModel: Model<JobSnapshot>,
    private readonly logger: Logger,
  ) {}

  @OnEvent(EventNames.JOB_STARTED)
  async handleJobStarted(data: JobCreatedDto) {
    const rawData = JSON.stringify(data);
    this.logger.log(
      `Saving job for event: ${EventNames.JOB_STARTED}, data: ${rawData}`,
      JobSnapshotService.name,
    );

    const jobSnapshot = new this.jobSnapshotModel({
      ...data,
      clientId: data.user,
    });

    await jobSnapshot.save();

    this.logger.log(
      `Job snapshot for event: ${EventNames.JOB_STARTED}, data: ${rawData} saved successfully`,
      JobSnapshotService.name,
    );
  }
}
