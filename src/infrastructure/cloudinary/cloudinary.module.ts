import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import cloudConfig from 'src/config/cloud.config';
@Module({
  imports: [ConfigModule.forFeature(cloudConfig)],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModuleWrapper {}
