import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { ExtendedRequest } from 'src/authentication/types/extended-req.type';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/res/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({
    description: 'Get Current User Info',
  })
  @ApiResponse({
    type: () => UserResponseDto,
  })
  @Get('me')
  getUserInfo(@Request() req: ExtendedRequest) {
    return this.userService.findById(req.user.id);
  }
}
