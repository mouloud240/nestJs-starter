import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { compareHash } from 'src/common/utils/authentication/bcrypt.utils';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { registerDto } from './dtos/requests/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/interfaces/app-config.interface';

@Injectable()
export class AuthenticationService {
  logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
  async issueTokens(user: User): Promise<AuthResponseDto> {
    try {
      const { id, email } = user;
      const accessTokenPayload = { sub: id, email };
      const refreshTokenPayload = { sub: id, email, type: 'refresh' };

      const jwtConfig =
        this.configService.get<AppConfig['auth']['jwt']>('auth.jwt')!;

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(accessTokenPayload, {
          expiresIn: jwtConfig.accessTokenExpiresIn,
          secret: jwtConfig.accessTokenSecret,
        }),
        this.jwtService.signAsync(refreshTokenPayload, {
          expiresIn: jwtConfig.refreshTokenExpiresIn,
          secret: jwtConfig.refreshTokenSecret,
        }),
      ]);

      return {
        accessToken,
        refreshToken,
        user: user,
      };
    } catch (error) {
      this.logger.error('Error issuing tokens', error);
      throw new Error('Failed to issue tokens');
    }
  }
  async registerUser(data: registerDto) {
    const user = await this.userService.createUser(data);
    const tokens = await this.issueTokens(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: user,
    };
  }
}
