import { Inject, Injectable } from '@nestjs/common';
import { registerDto } from 'src/core/authentication/v1/dtos/requests/register.dto';
import { User } from '../entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from '../repository/user.respository-interface';
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  createUser(data: registerDto): Promise<User> {
    return this.userRepository.createUser(data);
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  updateUser(user: User): Promise<User> {
    return this.userRepository.updateUser(user);
  }
}
