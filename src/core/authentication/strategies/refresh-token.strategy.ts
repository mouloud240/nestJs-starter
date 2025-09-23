import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenPayload } from '../interfaces/refresh-token.dto';
import { UserService } from 'src/core/user/user.service';
import { User } from 'src/core/user/entities/user.entity';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.refreshTokenSecret')!,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<User | null> {
    return this.userService.findById(payload.id);
  }
}
