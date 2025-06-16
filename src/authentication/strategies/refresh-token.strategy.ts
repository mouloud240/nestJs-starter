import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { RefreshTokenPayload } from '../interfaces/refresh-token.dto';
import { User } from 'src/user/entities/user.entity';


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
