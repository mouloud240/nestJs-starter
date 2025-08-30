import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { ElasticsearchService } from '@nestjs/elasticsearch';

/**
 * ElasticsearchHealthIndicator: Custom health check for Elasticsearch cluster
 *
 * This indicator provides multiple levels of health checking for Elasticsearch:
 * - Basic connectivity (ping)
 * - Cluster health status monitoring
 * - Node availability verification
 * - Performance metrics collection
 *
 * Elasticsearch Health Levels:
 * - Green: All shards allocated, cluster fully operational
 * - Yellow: All primary shards allocated, some replicas missing
 * - Red: Some primary shards not allocated, data loss possible
 */
@Injectable()
export class ElasticsearchHealthIndicator extends HealthIndicator {
  constructor(private readonly es: ElasticsearchService) {
    super();
  }

  /**
   * Basic connectivity check using ping
   * Fast check suitable for liveness probes
   */
  async isHealthy(
    key: string,
    options?: {
      timeout?: number;
    },
  ): Promise<HealthIndicatorResult> {
    const timeout = options?.timeout ?? 5000;

    try {
      const start = Date.now();

      // Race between ping and timeout
      let timer: NodeJS.Timeout | undefined;
      await Promise.race([
        this.es.ping(),
        new Promise((_, reject) => {
          timer = setTimeout(
            () =>
              reject(
                new Error(`Elasticsearch ping timeout after ${timeout}ms`),
              ),
            timeout,
          );
          // Avoid keeping the event loop alive in tests/CI
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (timer as any)?.unref?.();
        }),
      ]);
      if (timer) clearTimeout(timer);

      const latencyMs = Date.now() - start;

      return this.getStatus(key, true, {
        latencyMs,
        checkType: 'ping',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return this.getStatus(key, false, {
        error: String(error),
        message: error instanceof Error ? error.message : 'Unknown error',
        checkType: 'ping',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Comprehensive cluster health check
   * Checks cluster status and requires 'green' or 'yellow' for healthy status
   * Use this for readiness probes where you need the cluster to be functional
   */
  async checkClusterHealth(
    key: string,
    options?: {
      acceptYellow?: boolean; // Whether to consider 'yellow' status as healthy
      timeout?: number;
    },
  ): Promise<HealthIndicatorResult> {
    const acceptYellow = options?.acceptYellow ?? true;
    const timeout = options?.timeout ?? 10000;

    try {
      const start = Date.now();

      let timer: NodeJS.Timeout | undefined;
      const healthResponse = (await Promise.race([
        this.es.cluster.health(),
        new Promise((_, reject) => {
          timer = setTimeout(
            () =>
              reject(new Error(`Cluster health timeout after ${timeout}ms`)),
            timeout,
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (timer as any)?.unref?.();
        }),
      ])) as any;
      if (timer) clearTimeout(timer);

      const latencyMs = Date.now() - start;
      const clusterStatus = healthResponse.status;

      // Determine if the cluster is healthy based on status
      const isHealthy =
        clusterStatus === 'green' ||
        (acceptYellow && clusterStatus === 'yellow');

      const metadata = {
        latencyMs,
        clusterStatus,
        clusterName: healthResponse.cluster_name,
        numberOfNodes: healthResponse.number_of_nodes,
        numberOfDataNodes: healthResponse.number_of_data_nodes,
        activePrimaryShards: healthResponse.active_primary_shards,
        activeShards: healthResponse.active_shards,
        relocatingShards: healthResponse.relocating_shards,
        initializingShards: healthResponse.initializing_shards,
        unassignedShards: healthResponse.unassigned_shards,
        checkType: 'cluster',
        timestamp: new Date().toISOString(),
      };

      return this.getStatus(key, isHealthy, metadata);
    } catch (error) {
      return this.getStatus(key, false, {
        error: String(error),
        message: error instanceof Error ? error.message : 'Unknown error',
        checkType: 'cluster',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Strict cluster health check - only considers 'green' status as healthy
   * Use this for critical production environments where replica availability is required
   */
  async checkClusterHealthStrict(key: string): Promise<HealthIndicatorResult> {
    return this.checkClusterHealth(key, { acceptYellow: false });
  }

  /**
   * Quick cluster status check without detailed shard information
   * Faster than full cluster health, useful for frequent monitoring
   */
  async checkClusterStatus(key: string): Promise<HealthIndicatorResult> {
    try {
      const start = Date.now();
      const response = await this.es.cluster.health({ level: 'cluster' });
      const latencyMs = Date.now() - start;

      const isHealthy =
        response.status === 'green' || response.status === 'yellow';

      return this.getStatus(key, isHealthy, {
        latencyMs,
        status: response.status,
        clusterName: response.cluster_name,
        numberOfNodes: response.number_of_nodes,
        checkType: 'status',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return this.getStatus(key, false, {
        error: String(error),
        checkType: 'status',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Node-specific health check
   * Verifies that specific nodes are available and responsive
   */
  async checkNodes(key: string): Promise<HealthIndicatorResult> {
    try {
      const start = Date.now();
      const nodesInfo = await this.es.nodes.info();
      const latencyMs = Date.now() - start;

      const nodeCount = Object.keys(nodesInfo.nodes).length;
      const nodeNames = Object.values(nodesInfo.nodes).map(
        (node: any) => node.name,
      );

      return this.getStatus(key, nodeCount > 0, {
        latencyMs,
        nodeCount,
        nodeNames,
        checkType: 'nodes',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return this.getStatus(key, false, {
        error: String(error),
        checkType: 'nodes',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
