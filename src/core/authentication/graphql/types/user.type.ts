import { Field, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL User object type
 *
 * Represents a user in the system
 * Password field is intentionally excluded from GraphQL schema for security
 */
@ObjectType('User')
export class UserType {
  @Field(() => String, { description: 'User unique identifier' })
  id: string;

  @Field(() => String, { description: 'User email address' })
  email: string;

  @Field(() => Boolean, {
    description: 'Whether the user has verified their email',
  })
  isMailVerified: boolean;

  // Password is intentionally not exposed in GraphQL schema
}
