import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAME } from './common/constants/queues';
import { Queue } from 'bullmq';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadOptionsDto } from './user/dtos/upload-options.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() options: UploadOptionsDto,
  ) {
    return this.appService.uploadFile(file, options);
  }
}
