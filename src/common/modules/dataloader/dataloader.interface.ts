import DataLoader from 'dataloader';
import { User } from '../../../core/user/entities/user.entity';

/**
 * Interface for all DataLoaders available in GraphQL context
 * 
 * Add new loaders here as you implement them for other entities
 */
export interface IDataLoaders {
  /**
   * User entity loader - batches User.findById() queries
   */
  userLoader: DataLoader<string, User | null>;
}
