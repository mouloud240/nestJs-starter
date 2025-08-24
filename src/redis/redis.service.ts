import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AppConfig } from 'src/config/interfaces/app-config.interface';
import { RedisClient, RedisClientType } from './types/redis-cache.type';

@Injectable()
export class RedisService implements OnModuleInit {
  logger = new Logger(RedisService.name);
  private readonly persistentClient: Redis;
  private readonly cachedClient: Redis;
  private readonly subscriberClient: Redis;

  constructor(private readonly configService: ConfigService<AppConfig, true>) {
    const redisHost = this.configService.get('redis.host', { infer: true });
    const redisPort = this.configService.get('redis.port', { infer: true });
    const persistentDb = this.configService.get('redis.persistentDb', {
      infer: true,
    });
    const cachedDb = this.configService.get('redis.cachedDb', { infer: true });

    this.persistentClient = new Redis({
      host: redisHost,
      port: redisPort,
      db: persistentDb,
    });
    this.cachedClient = new Redis({
      host: redisHost,
      port: redisPort,
      db: cachedDb,
    });
    this.subscriberClient = new Redis({ host: redisHost, port: redisPort });

    this.persistentClient
      .hello()
      .then(() => this.logger.log('Persistent Redis is Connected'))
      .catch((e) => {
        this.logger.error('Error connecting to persistent Redis', e);
      });
    this.cachedClient
      .ping()
      .then(() => this.logger.log('Cached Redis is Connected'))
      .catch((e) => {
        this.logger.error('Error connecting to cached Redis', e);
      });
  }
  async onModuleInit() {
    this.logger.log('Flushing cached Redis database');
    await this.cachedClient.flushdb();
  }

  private getClient(clientType: RedisClient): Redis {
    return clientType === RedisClientType.PERSISTENT
      ? this.persistentClient
      : this.cachedClient;
  }

  async set<T>(
    key: string,
    value: T,
    ttl?: number,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<void> {
    if (ttl) {
      await this.getClient(clientType).set(
        key,
        JSON.stringify(value),
        'EX',
        ttl,
      );
    } else {
      await this.getClient(clientType).set(key, JSON.stringify(value));
    }
  }
  async rPush<T>(
    key: string,
    value: T,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<void> {
    await this.getClient(clientType).rpush(key, JSON.stringify(value));
  }
  async lPush<T>(
    key: string,
    value: T,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<void> {
    await this.getClient(clientType).lpush(key, JSON.stringify(value));
  }
  async lPop<T>(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<T | null> {
    const data = await this.getClient(clientType).lpop(key);
    return data ? (JSON.parse(data) as T) : null;
  }
  async rPop<T>(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<T | null> {
    const data = await this.getClient(clientType).rpop(key);
    return data ? (JSON.parse(data) as T) : null;
  }
  async subscribe(
    channel: string,
    callback: (message: string) => void | Promise<void>,
  ) {
    //TODO:fix this logi later it looks sussy
    await this.subscriberClient.subscribe(channel);
    this.subscriberClient.on('message', (channel, message) => {
      if (channel === channel) {
        void callback(message);
      }
    });
  }
  //TODO:same for this
  async publish(
    channel: string,
    message: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ) {
    await this.getClient(clientType).publish(channel, message);
  }
  async getRange<T>(
    key: string,
    start: number = 0,
    end: number = -1,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<Array<T>> {
    const data = await this.getClient(clientType).lrange(key, start, end);
    return data.map((d) => JSON.parse(d) as T);
  }

  async get<T>(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<T | null> {
    const data = await this.getClient(clientType).get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async getMany<T>(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<Array<T>> {
    const data = await this.getClient(clientType).get(key);
    return data ? (JSON.parse(data) as Array<T>) : [];
  }

  async del(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<void> {
    await this.getClient(clientType).del(key);
  }
  async ttl(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    return this.getClient(clientType).ttl(key);
  }

  async sAdd(
    key: string,
    value: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    return this.getClient(clientType).sadd(key, value);
  }

  async sIsMember(
    key: string,
    value: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    return this.getClient(clientType).sismember(key, value);
  }

  async sMembers(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<string[]> {
    return this.getClient(clientType).smembers(key);
  }

  async hIncrBy(
    key: string,
    field: string,
    increment: number = 1,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    return this.getClient(clientType).hincrby(key, field, increment);
  }

  async hSet(
    key: string,
    field: string,
    value: string | number,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    return this.getClient(clientType).hset(key, field, value.toString());
  }

  async hGetAll(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<Record<string, string>> {
    return this.getClient(clientType).hgetall(key);
  }

  async hDel(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
    ...fields: string[]
  ): Promise<number> {
    return this.getClient(clientType).hdel(key, ...fields);
  }

  async sRem(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
    ...members: string[]
  ): Promise<number> {
    return this.getClient(clientType).srem(key, ...members);
  }

  async zRem(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
    ...members: string[]
  ): Promise<number> {
    return this.getClient(clientType).zrem(key, ...members);
  }

  async hGet(
    key: string,
    field: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<string | null> {
    return this.getClient(clientType).hget(key, field);
  }

  async sCard(
    key: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    return this.getClient(clientType).scard(key);
  }

  async zAdd(
    key: string,
    members: Array<{ score: number; value: string }>,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    const args: (string | number)[] = [];
    members.forEach((member) => {
      args.push(member.score, member.value);
    });
    return this.getClient(clientType).zadd(key, ...args);
  }

  async zRevRangeWithScores(
    key: string,
    start: number,
    stop: number,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<Array<{ score: number; value: string }>> {
    const result = await this.getClient(clientType).zrevrange(
      key,
      start,
      stop,
      'WITHSCORES',
    );
    const formatted: Array<{ score: number; value: string }> = [];

    for (let i = 0; i < result.length; i += 2) {
      formatted.push({
        value: result[i],
        score: parseFloat(result[i + 1]),
      });
    }

    return formatted;
  }

  /**
   * Deletes all Redis keys matching a specific pattern
   * @param pattern The pattern to match keys against (e.g., "user:*:profile")
   * @returns Number of keys deleted
   */
  async deleteByPattern(
    pattern: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<number> {
    let cursor = '0';
    let deleteCount = 0;
    const client = this.getClient(clientType);

    do {
      // Scan for keys matching the pattern
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );

      cursor = nextCursor;

      // Delete found keys if any
      if (keys.length > 0) {
        const deletedCount = await client.del(...keys);
        deleteCount += deletedCount;
      }
    } while (cursor !== '0'); // Continue until cursor returns to 0

    this.logger.debug(
      `Deleted ${deleteCount} keys matching pattern: ${pattern}`,
    );
    return deleteCount;
  }

  /**
   * Checks if any Redis keys matching a specific pattern exist
   * @param pattern The pattern to match keys against (e.g., "user:*:profile")
   * @returns True if any key matches the pattern, false otherwise
   */
  async existsByPattern(
    pattern: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<boolean> {
    let cursor = '0';
    const client = this.getClient(clientType);

    do {
      // Scan for keys matching the pattern
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );

      cursor = nextCursor;

      // If any keys are found, return true immediately
      if (keys.length > 0) {
        this.logger.debug(`Found keys matching pattern: ${pattern}`);
        return true;
      }
    } while (cursor !== '0'); // Continue until cursor returns to 0

    this.logger.debug(`No keys found matching pattern: ${pattern}`);
    return false;
  }

  /**
   * Gets all values from Redis keys matching a specific pattern
   * @param pattern The pattern to match keys against (e.g., "user:*:profile")
   * @returns Array of parsed values from matching keys
   */
  async getByPattern<T>(
    pattern: string,
    clientType: RedisClient = RedisClientType.CACHED,
  ): Promise<T[]> {
    let cursor = '0';
    const results: Array<T> = [];
    const client = this.getClient(clientType);
    do {
      // Scan for keys matching the pattern
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );

      cursor = nextCursor;

      // Get values for found keys
      if (keys.length > 0) {
        const values = await client.mget(...keys);

        // Parse and add non-null values to results
        for (const value of values) {
          if (value !== null) {
            try {
              const res = JSON.parse(value) as T;

              results.push(res);
            } catch (error) {
              this.logger.error(`Failed to parse value: ${value}`, error);
            }
          }
        }
      }
    } while (cursor !== '0'); // Continue until cursor returns to 0

    this.logger.debug(
      `Retrieved ${results.length} values matching pattern: ${pattern}`,
    );
    return results;
  }
}
