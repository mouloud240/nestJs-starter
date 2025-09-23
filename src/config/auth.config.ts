import { registerAs } from '@nestjs/config';
import { AuthConfig } from './interfaces/auth-config.interface';

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      accessTokenSecret:
        process.env.JWT_ACCESS_TOKEN_SECRET || 'defaultAccessTokenSecret',
      refreshTokenSecret:
        process.env.JWT_REFRESH_TOKEN_SECRET! || 'defaultRefreshTokenSecret',
      accessTokenExpiresIn: parseInt(
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '86400',
      ), // 1 day
      refreshTokenExpiresIn: parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || (86400 * 7).toString(),
      ), // 7 day
    },
    oauth: {
      google: {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        scope: ['email', 'profile'],
      },
    },
  }),
);
