import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExtendedRequest } from '../types/extended-req.type';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';

/**
 * Custom decorator to extract user from request
 *
 * Supports both HTTP (REST) and GraphQL contexts
 *
 * @param data - Optional property name to extract from user object
 * @param ctx - Execution context (HTTP or GraphQL)
 * @returns User object or specific user property
 *
 * @example
 * // Get entire user object (REST)
 * @Get('profile')
 * getProfile(@USER() user: User) { ... }
 *
 * @example
 * // Get specific user property (REST)
 * @Get('email')
 * getEmail(@USER('email') email: string) { ... }
 *
 * @example
 * // Get entire user object (GraphQL)
 * @Query(() => User)
 * currentUser(@USER() user: User) { ... }
 *
 * @example
 * // Get specific user property (GraphQL)
 * @Query(() => String)
 * myEmail(@USER('email') email: string) { ... }
 */
export const USER = createParamDecorator(
  (
    data: keyof AccessTokenPayload['user'] | undefined,
    ctx: ExecutionContext,
  ) => {
    // Try to get GraphQL context first
    const gqlCtx = GqlExecutionContext.create(ctx);
    let request: ExtendedRequest;

    // Check if this is a GraphQL request
    if (gqlCtx.getType() === 'graphql') {
      request = gqlCtx.getContext().req;
    } else {
      // Fall back to HTTP context
      request = ctx.switchToHttp().getRequest<ExtendedRequest>();
    }

    const { user } = request;
    if (!user) {
      throw new Error('User not found in request');
    }

    // If data is provided, return the specific property
    if (data) {
      return user[data];
    }

    // Otherwise, return the entire user object
    return user;
  },
);
