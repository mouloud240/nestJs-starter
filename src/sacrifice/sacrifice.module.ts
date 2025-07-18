import { Module } from '@nestjs/common';
import { SacrificeService } from './sacrifice.service';
import { SacrificeController } from './sacrifice.controller';

@Module({
  controllers: [SacrificeController],
  providers: [SacrificeService],
})
export class SacrificeModule {}
