import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenPayload } from '../interfaces/refresh-token.dto';
import { UserService } from 'src/core/user/user.service';
import { User } from 'src/core/user/entities/user.entity';
import authConfig from 'src/config/auth.config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    @Inject(authConfig.KEY) configService: ConfigType<typeof authConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.refreshTokenSecret,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<User | null> {
    return this.userService.findById(payload.id);
  }
}
