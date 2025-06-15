import { AppConfig } from './interfaces/app-config.interface';

export default (): AppConfig => ({
  redis:{
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  }
});
