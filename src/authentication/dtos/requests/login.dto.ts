import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'User password',
  })
  password: string;
}
