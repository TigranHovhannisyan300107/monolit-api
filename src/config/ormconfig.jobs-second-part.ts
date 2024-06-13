import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import * as process from 'node:process';
import { Job } from 'src/modules/job/entities/job.entity';
 
config();
const second_part_dataSource = new DataSource({
    type: 'postgres',
    migrations: [
      join(
        __dirname,
        `/../database/migrations/${process.env.POSTGRES_DB_SECOND_PART}/*.ts`,
      ),
    ],
    url: process.env.POSTGRES_URI_SECOND_PART,
    database: process.env.POSTGRES_DB_SECOND_PART,
    port: +process.env.POSTGRES_PORT_SECOND_PART || 5432,
    entities: [Job],
    password: process.env.POSTGRES_PASSWORD_SECOND_PART,
    username: process.env.POSTGRES_USER_SECOND_PART,
    host: process.env.POSTGRES_HOST_SECOND_PART,
  });

export default second_part_dataSource;
