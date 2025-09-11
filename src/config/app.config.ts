import { registerAs } from '@nestjs/config';
import { AppConfig } from './interfaces/app-config.interface';

export default registerAs(
  'app',
  (): AppConfig => ({
    throttler: {
      limit: parseInt(process.env.THROTTLER_LIMIT!, 10) || 100,
      ttl: parseInt(process.env.THROTTLER_TTL!, 10) || 60,
      blockDuration: parseInt(process.env.THROTTLER_BLOCK_DURATION!, 10) || 10,
      ignoreUserAgents: [/^curl\//i],
    },
  }),
);
