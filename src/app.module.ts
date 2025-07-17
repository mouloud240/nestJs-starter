import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { AppConfig } from './config/interfaces/app-config.interface';
import { QUEUE_NAME } from './common/constants/queues';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          limit: 100, // Maximum number of requests
          ttl: 60, // Time to live in seconds
          blockDuration: 10, // Block duration in seconds
          ignoreUserAgents: [/^curl\//i], // Ignore requests from curl user agent
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      validationSchema: null, // You can define a Joi schema here for validation if needed
      load: [appConfig],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<AppConfig['redis']['host']>(
          'redis.host',
          'localhost',
        );
        const redisPort = configService.get<AppConfig['redis']['port']>(
          'redis.port',
          6379,
        );
        const redisUrl = `redis://${redisHost}:${redisPort}`;
        return {
          connection: {
            host: redisHost,
            port: redisPort,
            url: redisUrl,
            db: 3, // Default database
          },
        };
      },

      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUE_NAME).map((queueName) => ({
        name: queueName,
      })),
    ),
    AuthenticationModule,
    UserModule,
    EmailModule,
    HealthModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
