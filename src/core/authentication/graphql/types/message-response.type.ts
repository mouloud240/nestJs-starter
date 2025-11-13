import { Field, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL response type for operations that return a simple message
 *
 * Used for operations like email verification, password reset, etc.
 *
 * @example
 * {
 *   message: "Email verified successfully."
 * }
 */
@ObjectType('MessageResponse')
export class MessageResponseType {
  @Field(() => String, { description: 'Response message' })
  message: string;
}
