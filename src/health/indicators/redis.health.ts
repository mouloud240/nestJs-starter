import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { RedisService } from 'src/redis/redis.service';
import { RedisClientType } from 'src/redis/types/redis-cache.type';

/**
 * RedisHealthIndicator: Custom health check for Redis connectivity
 *
 * This indicator extends the base HealthIndicator to provide Redis-specific
 * health monitoring with latency tracking and comprehensive error reporting.
 *
 * Key Features:
 * - Ping-based connectivity verification
 * - Latency measurement for performance monitoring
 * - Graceful error handling with detailed error information
 * - Integration with NestJS Terminus health check system
 */
@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  /**
   * Checks Redis health by sending a PING command
   *
   * @param key - Identifier for this health check in the response
   * @param options - Optional configuration for the health check
   * @returns Promise<HealthIndicatorResult> - Health status with metadata
   */
  async isHealthy(
    key: string,
    options?: {
      timeout?: number; // Timeout in milliseconds (default: 5000)
      maxLatency?: number; // Maximum acceptable latency in ms
    },
  ): Promise<HealthIndicatorResult> {
    const timeout = options?.timeout ?? 5000;
    const maxLatency = options?.maxLatency ?? 1000; // 1 second max latency

    let timer: NodeJS.Timeout | undefined;
    try {
      const start = Date.now();

      // Create a timeout promise to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Redis ping timeout after ${timeout}ms`)),
          timeout,
        );
        // Avoid keeping the event loop alive in tests/CI
        if (typeof timer?.unref === 'function') {
          timer.unref();
        }
      });

      // Race between ping and timeout
      await Promise.race([
        this.redisService.ping(RedisClientType.CACHED),
        timeoutPromise,
      ]);

      const latencyMs = Date.now() - start;
      const isHealthy = latencyMs <= maxLatency;

      return this.getStatus(key, isHealthy, {
        latencyMs,
        maxLatency,
        status: isHealthy ? 'healthy' : 'slow',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Comprehensive error information for debugging
      const errorInfo = {
        error: String(error),
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        redisState: this.redisService.getConnectionState(
          RedisClientType.CACHED,
        ),
      };

      return this.getStatus(key, false, errorInfo);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /**
   * Alternative health check using Redis INFO command
   * Provides more detailed Redis server information
   */
  async checkServerInfo(key: string): Promise<HealthIndicatorResult> {
    try {
      const start = Date.now();
      const info = await this.redisService.info('server');
      const latencyMs = Date.now() - start;

      // Parse basic info from Redis INFO response
      const lines = info.split('\r\n');
      const version = lines
        .find((line) => line.startsWith('redis_version:'))
        ?.split(':')[1];
      const uptime = lines
        .find((line) => line.startsWith('uptime_in_seconds:'))
        ?.split(':')[1];

      return this.getStatus(key, true, {
        latencyMs,
        version,
        uptimeSeconds: uptime ? parseInt(uptime) : undefined,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return this.getStatus(key, false, {
        error: String(error),
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Connection state handled via redisService.getConnectionState

  /**
   * Comprehensive Redis health check with memory usage monitoring
   * Useful for production environments with strict resource requirements
   */
  async checkWithMemoryUsage(key: string): Promise<HealthIndicatorResult> {
    try {
      const start = Date.now();
      const [pong, memoryInfo] = await Promise.all([
        this.redisService.ping(RedisClientType.CACHED),
        this.redisService.info('memory'),
      ]);
      const latencyMs = Date.now() - start;

      // Parse memory information
      const memoryLines = memoryInfo.split('\r\n');
      const usedMemory = memoryLines
        .find((line) => line.startsWith('used_memory:'))
        ?.split(':')[1];
      const maxMemory = memoryLines
        .find((line) => line.startsWith('maxmemory:'))
        ?.split(':')[1];

      return this.getStatus(key, true, {
        latencyMs,
        usedMemoryBytes: usedMemory ? parseInt(usedMemory) : undefined,
        maxMemoryBytes: maxMemory ? parseInt(maxMemory) : undefined,
        memoryUtilization:
          usedMemory && maxMemory
            ? ((parseInt(usedMemory) / parseInt(maxMemory)) * 100).toFixed(2) +
              '%'
            : undefined,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return this.getStatus(key, false, {
        error: String(error),
        redisState: this.redisService.getConnectionState(
          RedisClientType.CACHED,
        ),
        timestamp: new Date().toISOString(),
      });
    }
  }
}
