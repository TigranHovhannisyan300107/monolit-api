import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PGDatabaseConnections } from './enums';
import { ApiKey } from 'src/modules/api-key/entities/api-key.entity';
import { Job } from 'src/modules/job/entities/job.entity';

export const getOrmConfig = (
  configService: ConfigService,
  db: string,
  prefix = '',
): TypeOrmModuleOptions => {
  prefix = prefix ? `${prefix}.` : '';
  const database = configService.get<string>(`${prefix}postgres.${db}.db`);
  return {
    name:
      db === 'second_part'
        ? PGDatabaseConnections.SECOND_PART
        : PGDatabaseConnections.FIRST_PART,
    type: 'postgres',
    url: configService.get<string>(`${prefix}postgres.${db}.uri`),
    synchronize: true,
    host: configService.get<string>(`${prefix}postgres.${db}.host`),
    port: configService.get<number>(`${prefix}postgres.${db}.port`),
    username: configService.get<string>(`${prefix}postgres.${db}.user`),
    password: configService.get<string>(`${prefix}postgres.${db}.password`),
    database,
    schema: configService.get<string>(`${prefix}postgres.${db}.schema`),
    entities: db === 'second_part' ? [Job] : [ApiKey, Job],
    migrationsTableName: 'migrations',
    migrations: [
      __dirname + `/dist/src/database/migrations/${database}/*.{t,j}s`,
    ],
    migrationsRun: true,
    migrationsTransactionMode: 'all',
    retryAttempts: 10,
    retryDelay: 10000,
    autoLoadEntities: true,
    ssl: configService.get<string>('node.env') === 'production',
  };
};

const first_part_dynamic_entities = TypeOrmModule.forFeature(
  [ApiKey, Job],
  PGDatabaseConnections.FIRST_PART,
);

const second_part_dynamic_entities = TypeOrmModule.forFeature(
  [Job],
  PGDatabaseConnections.SECOND_PART,
);

const first_part_module = TypeOrmModule.forRootAsync({
  name: PGDatabaseConnections.FIRST_PART,
  useFactory: (configService: ConfigService) =>
    getOrmConfig(configService, 'first_part'),
  inject: [ConfigService],
});

const second_part_module = TypeOrmModule.forRootAsync({
  name: PGDatabaseConnections.SECOND_PART,
  useFactory: (configService: ConfigService) =>
    getOrmConfig(configService, 'second_part'),
  inject: [ConfigService],
});

@Global()
@Module({
  imports: [
    first_part_module,
    second_part_module,
    first_part_dynamic_entities,
    second_part_dynamic_entities,
  ],
  exports: [
    first_part_module,
    second_part_module,
    first_part_dynamic_entities,
    second_part_dynamic_entities,
  ],
})
export class TypeOrmConfigModule {}
