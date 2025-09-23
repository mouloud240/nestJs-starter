import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { UserService } from 'src/core/user/user.service';
import { User } from 'src/core/user/entities/user.entity';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.accessTokenSecret')!,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User | null> {
    return this.userService.findById(payload.sub);
  }
}
