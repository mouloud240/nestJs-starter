import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from './Match.decorator';

export class registerDto {
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
  @ApiProperty({ description: 'User phone number', type: 'string' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @ApiProperty({ description: 'the User first Name' })
  firstName: string;
  @IsString()
  @ApiProperty({ description: 'Last name' })
  lastName: string;
}
