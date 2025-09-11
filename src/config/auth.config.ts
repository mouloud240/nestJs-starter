import { registerAs } from '@nestjs/config';
import { AuthConfig } from './interfaces/auth-config.interface';

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
      accessTokenExpiresIn: parseInt(
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '86400',
      ), // 1 day
      refreshTokenExpiresIn: parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || (86400 * 7).toString(),
      ), // 7 day
    },
  }),
);

