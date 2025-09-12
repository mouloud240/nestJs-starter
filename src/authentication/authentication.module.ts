import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalGuard } from './guards/local.guard';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AcessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { GoogleGuard } from './guards/oauth/google.guard';
import { GoogleStrategy } from './strategies/oauth/google.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    LocalGuard,
    AccessTokenStrategy,
    AcessTokenGuard,
    RefreshTokenStrategy,
    GoogleGuard,
    GoogleStrategy,
    RefreshTokenGuard,
  ],
  exports: [AcessTokenGuard],
})
export class AuthenticationModule {}
