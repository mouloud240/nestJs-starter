import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  db: parseInt(process.env.REDIS_DB!, 10) || 0,
  // this sets the redis module to be global
  isGlobal: true,
}));
