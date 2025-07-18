import { Injectable, Logger } from '@nestjs/common';
import { result } from 'src/common/utils/result.util';
import { compareHash } from 'src/common/utils/authentication/bcrypt.utils';
import { err } from 'src/common/utils/result.util';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { registerDto } from './dtos/requests/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ok } from '../common/utils/result.util';
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

  /**
   * Validates a user's credentials.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<result<User, string>>} A result object containing the user if validation is successful, or an error message if not.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<result<User, string>> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return err('User not found');
    }
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      return err('Invalid password');
    }
    return { ok: true, value: user };
  }

  /**
   * Issues new access and refresh tokens for a user.
   * @param {User} user - The user object.
   * @returns {Promise<result<AuthResponseDto, string>>} A result object containing the access token, refresh token, and user details, or an error message.
   */
  async issueTokens(user: User): Promise<result<AuthResponseDto, string>> {
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
        ok: true,
        value: {
          //TODO : add jwt token generation logic here
          accessToken, // Replace with actual token generation logic
          refreshToken, // Replace with actual token generation logic
          user: user,
        },
      };
    } catch (error) {
      this.logger.error('Error issuing tokens', error);
      return err('Failed to issue tokens');
    }
  }

  /**
   * Registers a new user.
   * @param {registerDto} data - The user registration data.
   * @returns {Promise<result<AuthResponseDto, string>>} A result object containing the access token, refresh token, and user details, or an error message.
   */
  async registerUser(data: registerDto) {
    const user = await this.userService.createUser(data);
    const tokens = await this.issueTokens(user);
    if (!tokens.ok) {
      return err('Failed to issue tokens');
    }
    return ok({
      accessToken: tokens.value.accessToken,
      refreshToken: tokens.value.refreshToken,
      user: user,
    });
  }
}
