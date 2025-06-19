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

  auth: {
    jwt: {
      accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'Not Secure',
      refreshTokenSecret:
        process.env.JWT_REFRESH_TOKEN_SECRET! || 'Not Secure too',
      accessTokenExpiresIn: parseInt(
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '86400',
      ), // 1 day
      refreshTokenExpiresIn: parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || (86400 * 7).toString(),
      ), // 7 day
    },
  },
});
