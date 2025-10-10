import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule} from '@nestjs/config';
import mailConfig from './config/mail.config';
import redisConfig from './config/redis.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { SecurityModule } from './security/security.module';
import { CommonModule } from './common/modules/common.module';
import { CoreModule } from './core/core.module';
import elasticSearchConfig from './config/elastic-search.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      validationSchema: null, // You can define a Joi schema here for validation if needed
      expandVariables: true,
      load: [
        mailConfig,
        redisConfig,
        authConfig,
        appConfig,
        elasticSearchConfig,
      ],
    }),
    InfrastructureModule,
    MonitoringModule,
    SecurityModule,
    CommonModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
