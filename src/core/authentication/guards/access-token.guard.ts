import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Guard for protecting routes with access token authentication
 *
 * Supports both HTTP (REST) and GraphQL contexts by implementing
 * the getRequest method to extract the request object appropriately
 *
 * @example
 * // REST usage
 * @UseGuards(AccessTokenGuard)
 * @Get('profile')
 * getProfile(@USER() user: User) { ... }
 *
 * @example
 * // GraphQL usage
 * @UseGuards(AccessTokenGuard)
 * @Query(() => User)
 * currentUser(@USER() user: User) { ... }
 */
export class AccessTokenGuard extends AuthGuard('access-token') {
  constructor() {
    super();
  }

  /**
   * Extracts the request object from either HTTP or GraphQL context
   *
   * @param context - The execution context (HTTP or GraphQL)
   * @returns The request object containing headers and user information
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // If GraphQL context exists, use it; otherwise fall back to HTTP
    return ctx.getContext().req || context.switchToHttp().getRequest();
  }
}
