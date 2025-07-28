import { Module } from '@nestjs/common';
import { SacrificerSacrificesCountService } from './sacrificer-sacrifices-count.service';
import { SacrificerSacrificesCountController } from './sacrificer-sacrifices-count.controller';

@Module({
  controllers: [SacrificerSacrificesCountController],
  providers: [SacrificerSacrificesCountService],
})
export class SacrificerSacrificesCountModule {}
