import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { AppConfig } from './config/interfaces/app-config.interface';
import { QUEUE_NAME } from './common/constants/queues';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      validationSchema: null, // You can define a Joi schema here for validation if needed
      load: [appConfig],
    }),
    BullModule.forRootAsync({
      useFactory: async (configService:ConfigService) => {
        const redisHost = configService.get<AppConfig['redis']['host']>('redis.host','localhost');
        const redisPort = configService.get<AppConfig['redis']['port']>('redis.port', 6379);
        const redisUrl = `redis://${redisHost}:${redisPort}`;
        return {
          connection: {
            host: redisHost,
            port: redisPort,
            url: redisUrl,
          },
           
        };
      },
  
      inject :[ConfigService] 
      
    
    }),
    BullModule.registerQueue(...Object.values(QUEUE_NAME).map((queueName) => ({
        name: queueName,
      })),
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
