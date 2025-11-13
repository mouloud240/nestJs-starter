import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { USER } from '../decorators/user.decorartor';
import { User } from 'src/core/user/entities/user.entity';
import { GoogleGuard } from '../guards/oauth/google.guard';

/**
 * Authentication controller for OAuth flows only
 *
 * This controller handles OAuth authentication flows that require
 * browser redirects (Google OAuth). All other authentication operations
 * have been migrated to GraphQL (see authentication.resolver.ts).
 *
 * OAuth flows remain in REST because:
 * 1. They require browser redirects
 * 2. External OAuth providers don't support GraphQL
 * 3. Standard OAuth flow expects specific HTTP endpoints
 */
@ApiTags('Authentication - OAuth')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  /**
   * Initiates Google OAuth2 login flow
   *
   * Redirects user to Google's consent screen
   */
  @ApiOperation({
    summary: 'Google OAuth2 login',
    description: 'Initiates the Google OAuth2 login flow.',
  })
  @UseGuards(GoogleGuard)
  @Get('oauth/google')
  googleAuth() {
    return;
  }

  /**
   * Google OAuth2 callback endpoint
   *
   * Receives authorization code from Google and issues tokens
   *
   * @param user - User object populated by GoogleGuard strategy
   * @returns Access token, refresh token, and user details
   */
  @ApiOkResponse({
    description: 'Returns the access token, refresh token, and user details.',
    type: () => AuthResponseDto,
  })
  @UseGuards(GoogleGuard)
  @Get('oauth/google/callback')
  googleAuthRedirect(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }
}
