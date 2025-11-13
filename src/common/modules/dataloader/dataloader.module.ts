import { Module } from '@nestjs/common';
import { UserDataLoader } from './user.dataloader';
import { UserModule } from '../../../core/user/user.module';

/**
 * DataLoader Module
 * 
 * Provides DataLoader services for batching and caching database queries
 * to solve N+1 query problems in GraphQL resolvers.
 * 
 * Note: DataLoader instances are created per-request in the GraphQL context,
 * not as singleton services. This module only provides the factory services.
 */
@Module({
  imports: [UserModule],
  providers: [UserDataLoader],
  exports: [UserDataLoader],
})
export class DataLoaderModule {}
