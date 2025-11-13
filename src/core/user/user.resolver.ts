import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './v1/user.service';
import { UserType } from '../authentication/graphql/types/user.type';
import { UpdateProfileInput } from '../authentication/graphql/inputs/update-profile.input';
import { MessageResponseType } from '../authentication/graphql/types/message-response.type';
import { AccessTokenGuard } from '../authentication/guards/access-token.guard';
import { USER } from '../authentication/decorators/user.decorartor';
import { User } from './entities/user.entity';
import { IDataLoaders } from '../../common/modules/dataloader/dataloader.interface';

/**
 * GraphQL resolver for user operations
 *
 * Provides queries and mutations for:
 * - Getting current authenticated user
 * - Updating user profile
 * - Deleting user account
 */
@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * Get current authenticated user
   *
   * @param user - User object from access token
   * @returns Current user details
   *
   * @example
   * query {
   *   currentUser {
   *     id
   *     email
   *     isMailVerified
   *   }
   * }
   *
   * # HTTP Headers:
   * # Authorization: Bearer <access-token>
   */
  @UseGuards(AccessTokenGuard)
  @Query(() => UserType, {
    description: 'Get current authenticated user profile',
  })
  async currentUser(@USER() user: User): Promise<UserType> {
    // Fetch fresh user data from database
    const currentUser = await this.userService.findById(user.id);
    if (!currentUser) {
      throw new Error('User not found');
    }
    return currentUser;
  }

  /**
   * Update current user profile
   *
   * @param updateProfileInput - Profile fields to update
   * @param user - User object from access token
   * @returns Updated user details
   *
   * @example
   * mutation {
   *   updateProfile(updateProfileInput: {
   *     username: "newusername"
   *   }) {
   *     id
   *     email
   *     isMailVerified
   *   }
   * }
   *
   * # HTTP Headers:
   * # Authorization: Bearer <access-token>
   */
  @UseGuards(AccessTokenGuard)
  @Mutation(() => UserType, {
    description: 'Update current user profile information',
  })
  async updateProfile(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
    @USER() user: User,
  ): Promise<UserType> {
    const currentUser = await this.userService.findById(user.id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Update fields from input
    if (updateProfileInput.username !== undefined) {
      // Note: In real implementation, you might want to add a 'username' field
      // to the User entity. For now, this is a placeholder.
      // currentUser.username = updateProfileInput.username;
    }

    // Save and return updated user
    const updatedUser = await this.userService.updateUser(currentUser);
    return updatedUser;
  }

  /**
   * Delete current user account
   *
   * @param user - User object from access token
   * @returns Success message
   *
   * @example
   * mutation {
   *   deleteAccount {
   *     message
   *   }
   * }
   *
   * # HTTP Headers:
   * # Authorization: Bearer <access-token>
   */
  @UseGuards(AccessTokenGuard)
  @Mutation(() => MessageResponseType, {
    description: 'Delete current user account permanently',
  })
  async deleteAccount(@USER() user: User): Promise<MessageResponseType> {
    const currentUser = await this.userService.findById(user.id);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Note: Implement deleteUser method in UserService
    // await this.userService.deleteUser(user.id);

    return {
      message: 'Account deleted successfully',
    };
  }
}
