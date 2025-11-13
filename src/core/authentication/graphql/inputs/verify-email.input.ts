import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

/**
 * Input type for verify email mutation
 *
 * @example
 * mutation {
 *   verifyEmail(verifyEmailInput: {
 *     email: "user@example.com"
 *     code: "123456"
 *   }) {
 *     message
 *   }
 * }
 */
@InputType()
export class VerifyEmailInput {
  @Field(() => String, { description: 'User email address' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Verification code sent to email' })
  @IsString()
  code: string;
}
