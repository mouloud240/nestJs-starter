import { AppConfig } from './interfaces/app-config.interface';

export default (): AppConfig => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  },
  mail: {
    port: parseInt(process.env.MAIL_PORT!, 10) || 587,
    host: process.env.MAIL_HOST || 'smtp.example.com',
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER!,
      pass: process.env.MAIL_PASS!,
    },
  },
});
