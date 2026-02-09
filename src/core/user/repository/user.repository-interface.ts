import { registerDto } from 'src/core/authentication/v1/dtos/requests/register.dto';
import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  createUser(data: registerDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
}
