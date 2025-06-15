import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({
    description: 'The access token for the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
  @ApiProperty({
    description: 'The refresh token for the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
  @ApiProperty({
    description: 'The user object containing user details',
    type: () => User,
  })
  user: User;
}
