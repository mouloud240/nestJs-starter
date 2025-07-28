import { Module } from '@nestjs/common';
import { SacrificeService } from './sacrifice.service';
import { SacrificeController } from './sacrifice.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  controllers: [SacrificeController],
  providers: [SacrificeService],
  imports: [AuthenticationModule],
})
export class SacrificeModule {}
