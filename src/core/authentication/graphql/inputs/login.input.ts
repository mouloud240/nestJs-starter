import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

/**
 * Input type for login mutation
 *
 * @example
 * mutation {
 *   login(loginInput: { email: "user@example.com", password: "password123" }) {
 *     accessToken
 *     refreshToken
 *     user { id email }
 *   }
 * }
 */
@InputType()
export class LoginInput {
  @Field(() => String, { description: 'User email address' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'User password' })
  @IsString()
  password: string;
}
