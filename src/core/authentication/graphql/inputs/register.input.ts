import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from '../../v1/dtos/requests/Match.decorator';

/**
 * Input type for register mutation
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
@InputType()
export class RegisterInput {
  @Field(() => String, { description: 'Username for the new user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String, { description: 'Email address for the new user' })
  @IsEmail()
  email: string;

  @Field(() => String, {
    description: 'Password for the new user, must be strong and secure',
  })
  @IsStrongPassword()
  password: string;

  @Field(() => String, {
    description: 'Confirm password for the new user, must match the password',
  })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
