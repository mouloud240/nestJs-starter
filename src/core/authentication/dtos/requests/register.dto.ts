import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from './Match.decorator';

export class registerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Username for the new user',
  })
  username: string;
  @ApiProperty({
    type: String,
    description: 'Email address for the new user',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
    description: 'Password for the new user , must be strong and secure',
  })
  @IsStrongPassword()
  password: string;

  @Match('password', { message: 'Passwords do not match' })
  @ApiProperty({
    type: String,
    description: 'Confirm password for the new user, must match the password',
  })
  confirmPassword: string;
}
