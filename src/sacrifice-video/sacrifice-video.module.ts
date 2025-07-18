import { Module } from '@nestjs/common';
import { SacrificeVideoService } from './sacrifice-video.service';
import { SacrificeVideoController } from './sacrifice-video.controller';

@Module({
  controllers: [SacrificeVideoController],
  providers: [SacrificeVideoService],
})
export class SacrificeVideoModule {}
