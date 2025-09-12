import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import {
  compareHash,
  generateHash,
} from 'src/common/utils/authentication/bcrypt.utils';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { registerDto } from './dtos/requests/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { RedisService } from 'nestjs-redis-client';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { Queue } from 'bullmq';
import { MAIL_JOBS } from 'src/common/constants/jobs';
import { v4 as uuidv4 } from 'uuid';
import authConfig from 'src/config/auth.config';
import { Profile } from 'passport-google-oauth20';

@Injectable()
export class AuthenticationService {
  logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY) authenicationConfig: ConfigType<typeof authConfig>,
    private readonly redisService: RedisService,
    @InjectQueue(QUEUE_NAME.MAIL) private readonly mailQueue: Queue,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isMailVerified) {
      throw new UnauthorizedException('Email not verified');
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

      const jwtConfig = authConfig().jwt;

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
    await this.sendVerificationCode(user);
    return {
      message:
        'User registered successfully. Please check your email for verification code.',
    };
  }
  logOauthUser(profile: Profile): Promise<User> {
    throw new Error('Method not implemented.');
  }
  private async generateAndSetOtp(user: User): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`verification:${user.email}`, otp, 600);
    return otp;
  }

  async sendVerificationCode(user: User) {
    const otp = await this.generateAndSetOtp(user);
    await this.mailQueue.add(MAIL_JOBS.SEND_VERIFICATION_MAIL, {
      to: user.email,
      code: otp,
    });
  }

  async resendVerificationCode(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.sendVerificationCode(user);
    return {
      message: 'Verification code sent successfully. Please check your email.',
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const storedCode = await this.redisService.get(`verification:${email}`);
    if (storedCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }
    user.isMailVerified = true;
    await this.userService.updateUser(user);
    await this.redisService.del(`verification:${email}`);
    return {
      message: 'Email verified successfully.',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = uuidv4();
    await this.redisService.set(`password-reset:${token}`, user.email, 600);
    await this.mailQueue.add(MAIL_JOBS.SEND_PASSWORD_RESET_MAIL, {
      to: user.email,
      token,
    });
    return {
      message:
        'Password reset email sent successfully. Please check your email.',
    };
  }

  async resetPassword(token: string, password: string) {
    const email = await this.redisService.get<string>(
      `password-reset:${token}`,
    );
    if (!email) {
      throw new BadRequestException('Invalid reset token');
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = await generateHash(password);
    await this.userService.updateUser(user);
    await this.redisService.del(`password-reset:${token}`);
    return {
      message: 'Password reset successfully.',
    };
  }
}
