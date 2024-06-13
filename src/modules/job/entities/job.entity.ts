import { Column, Entity } from 'typeorm';
import { BasePGEntity } from '../../../database/postgres/base.entity';

@Entity('jobs')
export class Job extends BasePGEntity {
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ nullable: false })
  user: string;
}
