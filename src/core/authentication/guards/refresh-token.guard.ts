import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Guard for protecting token refresh endpoints
 *
 * Supports both HTTP (REST) and GraphQL contexts by implementing
 * the getRequest method to extract the request object appropriately
 *
 * @example
 * // REST usage
 * @UseGuards(RefreshTokenGuard)
 * @Post('refresh')
 * refreshTokens(@USER() user: User) { ... }
 *
 * @example
 * // GraphQL usage
 * @UseGuards(RefreshTokenGuard)
 * @Mutation(() => AuthResponse)
 * refreshTokens(@USER() user: User) { ... }
 */
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
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
