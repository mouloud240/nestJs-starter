import { Injectable } from '@nestjs/common';
import { registerDto } from 'src/core/authentication/v1/dtos/requests/register.dto';
import { User } from '../entities/user.entity';
@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(data: registerDto): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  updateUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
