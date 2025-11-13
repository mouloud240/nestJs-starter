import { Module } from '@nestjs/common';
import { UserService } from './v1/user.service';
import { UserResolver } from './user.resolver';

/**
 * User module
 *
 * Provides user management functionality including:
 * - User CRUD operations
 * - Profile management
 * - GraphQL queries and mutations for user operations
 *
 * Note: All user endpoints are now GraphQL-based (see user.resolver.ts)
 */
@Module({
  controllers: [],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
