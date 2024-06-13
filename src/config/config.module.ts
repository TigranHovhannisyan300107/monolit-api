import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => ({
          node: {
            env: process.env.NODE_ENV || 'development',
          },
          base_url: process.env.BASE_URL || 'http://localhost',
          port: parseInt(process.env.PORT, 10) || 3000,
          mongo: {
            uri: process.env.MONGO_URI,
          },
          rateLimit: {
            hourly: {
              expiresIn: 60 * 60,
              maxRequests: 10,
            },
            'minute': {
              expiresIn: 5 * 60,
            },
          },
          postgres: {
            first_part: {
              host: process.env.POSTGRES_HOST_FIRST_PART,
              port: process.env.POSTGRES_PORT_FIRST_PART || 5432,
              user: process.env.POSTGRES_USER_FIRST_PART,
              password: process.env.POSTGRES_PASSWORD_FIRST_PART,
              schema: process.env.POSTGRES_SCHEMA_FIRST_PART,
              db: process.env.POSTGRES_DB_FIRST_PART,
              uri: process.env.POSTGRES_URI_FIRST_PART,
            },
            second_part: {
              host: process.env.POSTGRES_HOST_SECOND_PART,
              port: process.env.POSTGRES_PORT_SECOND_PART || 5433,
              user: process.env.POSTGRES_USER_SECOND_PART,
              password: process.env.POSTGRES_PASSWORD_SECOND_PART,
              schema: process.env.POSTGRES_SCHEMA_SECOND_PART,
              db: process.env.POSTGRES_DB_SECOND_PART,
              uri: process.env.POSTGRES_URI_SECOND_PART,
            },
          },
          redis: {
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
            port: process.env.REDIS_PORT || 6379,
            pubSubDB: process.env.REDIS_PUB_SUB_DB || 10,
            rateLimitDB: process.env.REDIS_RATE_LIMIT_DB || 1,
          },
        }),
      ],
      isGlobal: true,
    }),
  ],
})
export class AppConfigModule {}
