import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from './user.type';

/**
 * GraphQL response type for authentication operations
 *
 * Returns access token, refresh token, and user details
 *
 * @example
 * {
 *   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   user: {
 *     id: "uuid",
 *     email: "user@example.com",
 *     isMailVerified: true
 *   }
 * }
 */
@ObjectType('AuthResponse')
export class AuthResponseType {
  @Field(() => String, { description: 'JWT access token for authentication' })
  accessToken: string;

  @Field(() => String, { description: 'JWT refresh token for renewing access' })
  refreshToken: string;

  @Field(() => UserType, { description: 'Authenticated user details' })
  user: UserType;
}
