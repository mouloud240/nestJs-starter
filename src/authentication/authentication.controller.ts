import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LocalGuard } from './guards/local.guard';
import { USER } from './decorators/user.decorartor';
import { User } from 'src/user/entities/user.entity';
import { registerDto } from './dtos/requests/register.dto';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GoogleGuard } from './guards/oauth/google.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Logs in a user and issues access and refresh tokens.',
  })
  @ApiOkResponse({
    description: 'Returns the access token, refresh token, and user details.',
    type: () => AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials provided.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request body is invalid or missing required fields.',
  })
  async login(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }
  @ApiOperation({
    summary: 'Register user',
    description: 'Registers a new user and issues access and refresh tokens.',
  })
  @ApiOkResponse({
    description: 'Returns the access token, refresh token, and user details.',
    type: () => AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request body is invalid or missing required fields.',
  })
  @Post('register')
  async register(@Body() data: registerDto) {
    return this.authenticationService.registerUser(data);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Refreshes access and refresh tokens using a valid refresh token.',
  })
  @ApiOkResponse({
    description: 'Returns the new access token and refresh token.',
    type: () => AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid refresh token provided.',
  })
  async refreshTokens(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }

  @Post('resend-verification')
  @ApiOperation({
    summary: 'Resend verification email',
    description: 'Resends the verification email to the user.',
  })
  @ApiOkResponse({
    description: 'Returns a message indicating that the email has been sent.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async resendVerification(@Body('email') email: string) {
    return this.authenticationService.resendVerificationCode(email);
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify email',
    description: "Verifies the user's email with the provided code.",
  })
  @ApiOkResponse({
    description:
      'Returns a message indicating that the email has been verified.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid verification code.',
  })
  async verifyEmail(@Body('email') email: string, @Body('code') code: string) {
    return this.authenticationService.verifyEmail(email, code);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Sends a password reset email to the user.',
  })
  @ApiOkResponse({
    description: 'Returns a message indicating that the email has been sent.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async forgotPassword(@Body('email') email: string) {
    return this.authenticationService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: "Resets the user's password with the provided token.",
  })
  @ApiOkResponse({
    description:
      'Returns a message indicating that the password has been reset.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid reset token.',
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authenticationService.resetPassword(token, password);
  }

  @ApiOperation({
    summary: 'Google OAuth2 login',
    description: 'Initiates the Google OAuth2 login flow.',
  })
  @UseGuards(GoogleGuard)
  @Get('oauth/google')
  googleAuth() {
    return;
  }

  @UseGuards(GoogleGuard)
  @Get('oauth/google/callback')
  googleAuthRedirect(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }
}
