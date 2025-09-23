import { Module } from '@nestjs/common';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

@Module({
  imports: [RateLimitingModule],
  exports: [RateLimitingModule],
})
export class SecurityModule {}
