import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModuleWrapper {}
