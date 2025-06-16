import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LocalGuard } from './guards/local.guard';
import { USER } from './decorators/user.decorartor';
import { User } from 'src/user/entities/user.entity';
import { registerDto } from './dtos/requests/register.dto';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

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
    description: 'Bad Request. The request body is invalid or missing required fields.',
  })
  async login(@USER() user:User) {
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
    description: 'Bad Request. The request body is invalid or missing required fields.',
  })
  @Post('register')
  async register(@Body() data:registerDto) {
    return this.authenticationService.registerUser(data);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Refreshes access and refresh tokens using a valid refresh token.',
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
}
