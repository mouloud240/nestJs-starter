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
import { PrismaModule } from './prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { SacrificeModule } from './sacrifice/sacrifice.module';
import { NotificationModule } from './notification/notification.module';
import { SacrificeVideoModule } from './sacrifice-video/sacrifice-video.module';
import { SacrificerSacrificesCountModule } from './sacrificer-sacrifices-count/sacrificer-sacrifices-count.module';
import { DonationModule } from './donation/donation.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
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
    AuthenticationModule,
    UserModule,
    EmailModule,
    HealthModule,
    QueueModule,
    PrismaModule,
    PaymentModule,
    SacrificeModule,
    NotificationModule,
    SacrificeVideoModule,
    SacrificerSacrificesCountModule,
    QueueModule,
    DonationModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
