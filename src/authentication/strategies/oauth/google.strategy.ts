import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthenticationService } from 'src/authentication/authentication.service';
import authConfig from 'src/config/auth.config';
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly authService: AuthenticationService,
  ) {
    super(authConfiguration.oauth.google);
  }
  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = await this.authService.logOauthUser(profile);
    done(null, user);
  }
}
