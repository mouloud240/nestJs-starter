import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './indicators/redis.health';
import { ElasticsearchHealthIndicator } from './indicators/elasticsearch.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly elastic: ElasticsearchHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}
  @Get('liveness')
  @HealthCheck()
  liveness() {
    const ok: HealthIndicatorResult = { service: { status: 'up' } };
    return this.health.check([async () => ok]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.redis.isHealthy('redis'),
      () =>
        this.disk.checkStorage('disk', {
          thresholdPercent: 0.75,
          path: '/',
        }),
    ]);
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk', {
          thresholdPercent: 0.75,
          path: '/',
        }),
      () =>
        this.elastic.checkClusterHealth('elasticsearch_cluster', {
          acceptYellow: true,
          timeout: 8000,
        }),
    ]);
  }

  @Get('elasticsearch')
  @HealthCheck()
  elasticsearch() {
    return this.health.check([
      () => this.elastic.isHealthy('elasticsearch_ping', { timeout: 3000 }),
      () => this.elastic.checkClusterStatus('elasticsearch_status'),
    ]);
  }
}
