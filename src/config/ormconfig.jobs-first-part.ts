import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import * as process from 'node:process';
import { ApiKey } from '../modules/api-key/entities/api-key.entity';
import { Job } from 'src/modules/job/entities/job.entity';

config();

const first_part_dataSource = new DataSource({
  type: 'postgres',
  migrations: [
    join(
      __dirname,
      `/../database/migrations/${process.env.POSTGRES_DB_FIRST_PART}/*.ts`,
    ),
  ],
  url: process.env.POSTGRES_URI_FIRST_PART,
  database: process.env.POSTGRES_DB_FIRST_PART,
  port: +process.env.POSTGRES_PORT_FIRST_PART || 5432,
  entities: [ApiKey, Job],
  password: process.env.POSTGRES_PASSWORD_FIRST_PART,
  username: process.env.POSTGRES_USER_FIRST_PART,
  host: process.env.POSTGRES_HOST_FIRST_PART,
});
export default first_part_dataSource;
