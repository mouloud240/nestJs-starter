import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [HealthModule, LoggerModule],
  exports: [HealthModule, LoggerModule],
})
export class MonitoringModule {}
