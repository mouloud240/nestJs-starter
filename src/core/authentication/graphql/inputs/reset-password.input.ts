import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsStrongPassword } from 'class-validator';

/**
 * Input type for reset password mutation
 *
 * @example
 * mutation {
 *   resetPassword(resetPasswordInput: {
 *     token: "reset-token-uuid"
 *     password: "NewStrongPass123!"
 *   }) {
 *     message
 *   }
 * }
 */
@InputType()
export class ResetPasswordInput {
  @Field(() => String, { description: 'Password reset token from email' })
  @IsString()
  token: string;

  @Field(() => String, {
    description: 'New password, must be strong and secure',
  })
  @IsStrongPassword()
  password: string;
}
