import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CloudinaryModuleWrapper } from 'src/cloudinary/cloudinary.module';
import { QUEUE_NAME } from 'src/common/constants/queues';
import redisConfig from 'src/config/redis.config';
import { EmailModule } from 'src/email/email.module';
import { SearchModule } from 'src/search/search.module';
import { MailProcessor } from './mail/mail.processor';
import { SearchProcessor } from './search/search.processor';
import { UploadProcessor } from './upload/upload.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof redisConfig>) => {
        const redisHost = configService.host;
        const redisPort = configService.port;
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

      inject: [redisConfig.KEY],
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUE_NAME).map((queueName) => ({
        name: queueName,
      })),
    ),
    CloudinaryModuleWrapper,
    EmailModule,
    SearchModule,
  ],
  providers: [MailProcessor, SearchProcessor, UploadProcessor],
  exports: [BullModule],
})
export class QueueModule {}
