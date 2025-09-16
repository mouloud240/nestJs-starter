import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { QUEUE_NAME } from './common/constants/queues';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
import mailConfig from './config/mail.config';
import redisConfig from './config/redis.config';
import authConfig from './config/auth.config';
import { RedisModule } from 'nestjs-redis-client';
import cloudConfig from './config/cloud.config';
import appConfig from './config/app.config';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: '/graphql',
      playground: false,
      autoSchemaFile: true,
      context: ({ req, res, user }) => ({ req, res, user }),
      driver: ApolloDriver,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (appConf: ConfigType<typeof appConfig>) => ({
        throttlers: [
          {
            name: 'Main throttler',
            ...appConf.throttler,
          },
        ],
      }),
      inject: [appConfig.KEY],
    }),
    RedisModule.registerAsync(redisConfig.asProvider()),
    ConfigModule.forRoot({
      expandVariables: true,
      cache: true,
      isGlobal: true, // Makes the configuration available globally
      validationSchema: null, // You can define a Joi schema here for validation if needed
      load: [mailConfig, redisConfig, authConfig, appConfig],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('redis.host');
        const redisPort = configService.get<number>('redis.port');
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
