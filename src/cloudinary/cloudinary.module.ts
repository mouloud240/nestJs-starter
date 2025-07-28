import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { config } from 'process';
import { CloudinaryWrapperServiec } from './cloudinary.service';

@Module({
  imports: [
    CloudinaryModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        api_key: configService.get('cloudinary.apiKey'),
      }),
    }),
  ],
  providers:[CloudinaryWrapperService]
})
export class CloudinaryModuleWrapper {}
