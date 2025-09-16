import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAME } from './common/constants/queues';
import { Queue } from 'bullmq';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,@InjectQueue(QUEUE_NAME.UPLOAD) uploadQueue:Queue) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('upload')
}
