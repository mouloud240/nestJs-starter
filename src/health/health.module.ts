import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './indicators/redis.health';
import { ElasticsearchHealthIndicator } from './indicators/elasticsearch.health';
import { RedisModule } from '../redis/redis.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TerminusModule, RedisModule, SearchModule],
  controllers: [HealthController],
  providers: [
    // Wire the health indicators as providers
    RedisHealthIndicator,
    ElasticsearchHealthIndicator,
  ],
})
export class HealthModule {}
