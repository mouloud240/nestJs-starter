import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalGuard } from './guards/local.guard';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { GoogleGuard } from './guards/oauth/google.guard';
import { GoogleStrategy } from './strategies/oauth/google.strategy';
import { QueueModule } from 'src/infrastructure/queue/queue.module';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './v1/authentication.controller';
import { AuthenticationService } from './v1/authentication.service';
import { AuthenticationResolver } from './authentication.resolver';

/**
 * Authentication module
 *
 * Provides authentication and authorization functionality including:
 * - JWT-based authentication (access and refresh tokens)
 * - Local authentication (email/password)
 * - OAuth authentication (Google)
 * - GraphQL and REST API support
 *
 * GraphQL mutations handle most auth operations (login, register, etc.)
 * REST endpoints remain for OAuth flows (Google OAuth)
 */
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UserModule,
    QueueModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    AuthenticationResolver,
    LocalStrategy,
    LocalGuard,
    AccessTokenStrategy,
    AccessTokenGuard,
    RefreshTokenStrategy,
    GoogleGuard,
    GoogleStrategy,
    RefreshTokenGuard,
  ],
  exports: [AccessTokenGuard],
})
export class AuthenticationModule {}
