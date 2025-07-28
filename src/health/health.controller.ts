import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check the health of the service',
    description:
      'Checks the health of the service, including HTTP, disk, and memory.',
  })
  @ApiOkResponse({
    description: 'The health check results.',
  })
  check() {
    return this.health.check([
      () => this.http.pingCheck('github', 'https://github.com'),
      () =>
        this.disk.checkStorage('disk health', {
          thresholdPercent: 0.75,
          path: '/',
        }),
      () => this.memory.checkHeap('memory heap', 150 * 1024 * 1024), // 150 MB
      () => this.memory.checkRSS('memory RSS', 150 * 1024 * 1024), // 150 MB
    ]);
  }
}
