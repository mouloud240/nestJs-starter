import { Module } from '@nestjs/common';
import { AlsModule } from 'src/common/modules/async_storage/als.module';
import { LoggerServiceBuilder } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './logger.interceptor';

@Module({
  imports: [AlsModule],
  providers: [
    LoggerServiceBuilder,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
  exports: [LoggerServiceBuilder],
})
export class LoggerModule {}
