import { Inject, Injectable } from '@nestjs/common';
import {  ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import authConfig from 'src/config/auth.config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    @Inject(authConfig.KEY) configService: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.accessTokenSecret,
    });
  }

  validate(payload: AccessTokenPayload): AccessTokenPayload['user'] {
    return payload.user;
  }
}
