import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [HealthController],
  imports: [TerminusModule, HttpModule],
})
export class HealthModule {}
