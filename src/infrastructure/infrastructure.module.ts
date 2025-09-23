import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { DbModule } from './db/db.module';
import { CloudinaryModuleWrapper } from './cloudinary/cloudinary.module';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from 'nestjs-redis-client';
import { ConfigType } from '@nestjs/config';
import redisConfig from 'src/config/redis.config';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME } from 'src/common/constants/queues';

@Module({
  imports: [
    SearchModule,
    DbModule,
    CloudinaryModuleWrapper,
    QueueModule,
    RedisModule.registerAsync(redisConfig.asProvider()),
    BullModule.forRootAsync({
      inject: [redisConfig.KEY],
      useFactory: (config: ConfigType<typeof redisConfig>) => {
        return {
          connection: {
            host: config.host,
            port: config.port,
            url: `redis://${config.host}:${config.port}`,
            db: 3, // Default database
          },
        };
      },
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUE_NAME).map((queueName) => ({
        name: queueName,
      })),
    ),
  ],
  exports: [
    RedisModule,
    QueueModule,
    CloudinaryModuleWrapper,
    BullModule,
    DbModule,
  ],
})
export class InfrastructureModule {}
