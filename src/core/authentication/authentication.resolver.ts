import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthenticationService } from './v1/authentication.service';
import { AuthResponseType } from './graphql/types/auth-response.type';
import { MessageResponseType } from './graphql/types/message-response.type';
import { LoginInput } from './graphql/inputs/login.input';
import { RegisterInput } from './graphql/inputs/register.input';
import { VerifyEmailInput } from './graphql/inputs/verify-email.input';
import { ResetPasswordInput } from './graphql/inputs/reset-password.input';
import { LocalGuard } from './guards/local.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { USER } from './decorators/user.decorartor';
import { User } from 'src/core/user/entities/user.entity';

/**
 * GraphQL resolver for authentication operations
 *
 * Provides mutations for:
 * - User login
 * - User registration
 * - Token refresh
 * - Email verification
 * - Password reset flow
 *
 * OAuth operations remain in the REST controller
 */
@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  /**
   * Login user with email and password
   *
   * @param loginInput - Email and password credentials
   * @param user - User object populated by LocalGuard after validation
   * @returns Access token, refresh token, and user details
   *
   * @example
   * mutation {
   *   login(loginInput: {
   *     email: "user@example.com"
   *     password: "password123"
   *   }) {
   *     accessToken
   *     refreshToken
   *     user {
   *       id
   *       email
   *       isMailVerified
   *     }
   *   }
   * }
   */
  @UseGuards(LocalGuard)
  @Mutation(() => AuthResponseType, {
    description: 'Login user and issue access and refresh tokens',
  })
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @USER() user: User,
  ): Promise<AuthResponseType> {
    return this.authenticationService.issueTokens(user);
  }

  /**
   * Register a new user
   *
   * @param registerInput - User registration details (username, email, password)
   * @returns Success message
   *
   * @example
   * mutation {
   *   register(registerInput: {
   *     username: "johndoe"
   *     email: "john@example.com"
   *     password: "StrongPass123!"
   *     confirmPassword: "StrongPass123!"
   *   }) {
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponseType, {
    description: 'Register a new user and send verification email',
  })
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<MessageResponseType> {
    return this.authenticationService.registerUser(registerInput);
  }

  /**
   * Refresh access and refresh tokens
   *
   * @param user - User object populated by RefreshTokenGuard
   * @returns New access token and refresh token
   *
   * @example
   * mutation {
   *   refreshTokens {
   *     accessToken
   *     refreshToken
   *     user {
   *       id
   *       email
   *     }
   *   }
   * }
   *
   * # HTTP Headers:
   * # Authorization: Bearer <refresh-token>
   */
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => AuthResponseType, {
    description:
      'Refresh access and refresh tokens using a valid refresh token',
  })
  async refreshTokens(@USER() user: User): Promise<AuthResponseType> {
    return this.authenticationService.issueTokens(user);
  }

  /**
   * Resend email verification code
   *
   * @param email - User email address
   * @returns Success message
   *
   * @example
   * mutation {
   *   resendVerification(email: "user@example.com") {
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponseType, {
    description: 'Resend verification email to user',
  })
  async resendVerification(
    @Args('email') email: string,
  ): Promise<MessageResponseType> {
    return this.authenticationService.resendVerificationCode(email);
  }

  /**
   * Verify user email with verification code
   *
   * @param verifyEmailInput - Email and verification code
   * @returns Success message
   *
   * @example
   * mutation {
   *   verifyEmail(verifyEmailInput: {
   *     email: "user@example.com"
   *     code: "123456"
   *   }) {
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponseType, {
    description: 'Verify user email with the provided code',
  })
  async verifyEmail(
    @Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput,
  ): Promise<MessageResponseType> {
    return this.authenticationService.verifyEmail(
      verifyEmailInput.email,
      verifyEmailInput.code,
    );
  }

  /**
   * Request password reset email
   *
   * @param email - User email address
   * @returns Success message
   *
   * @example
   * mutation {
   *   forgotPassword(email: "user@example.com") {
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponseType, {
    description: 'Send password reset email to user',
  })
  async forgotPassword(
    @Args('email') email: string,
  ): Promise<MessageResponseType> {
    return this.authenticationService.forgotPassword(email);
  }

  /**
   * Reset password with reset token
   *
   * @param resetPasswordInput - Reset token and new password
   * @returns Success message
   *
   * @example
   * mutation {
   *   resetPassword(resetPasswordInput: {
   *     token: "reset-token-uuid"
   *     password: "NewStrongPass123!"
   *   }) {
   *     message
   *   }
   * }
   */
  @Mutation(() => MessageResponseType, {
    description: 'Reset user password with the provided token',
  })
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<MessageResponseType> {
    return this.authenticationService.resetPassword(
      resetPasswordInput.token,
      resetPasswordInput.password,
    );
  }
}
