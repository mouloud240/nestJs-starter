export const RedisClientType = {
  PERSISTENT: 'persistent',
  CACHED: 'cached',
} as const;

export type RedisClient =
  (typeof RedisClientType)[keyof typeof RedisClientType];

