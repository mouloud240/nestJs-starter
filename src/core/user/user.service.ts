import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from '../authentication/dtos/requests/register.dto';
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
