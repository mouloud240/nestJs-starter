import { Module } from '@nestjs/common';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

@Module({
  imports: [RateLimitingModule]
})
export class SecurityModule {}
