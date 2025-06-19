import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { result } from 'src/common/utils/result.util';

@Injectable()
export class UserService {
  createUser(data: registerDto): Promise<result<User, string>> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve) => {
      // 🔥 Simulate a CPU-bound blocking task (e.g. large Fibonacci calc or heavy loop)
      function cpuIntensiveWork() {
        let total = 0;
        for (let i = 0; i < 1e8; i++) {
          total += i % 10;
        }
        return total;
      }


      const user = new User();
      user.id = '1';
      user.email = email;
      user.password =
        '$2a$10$osXgaVgM7tBklCiYiBPGUOVtXqCSzdjp157l4HJnsNlscsoNJGuuO'; // hashed pw

      resolve(user);
    });
  }
  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}
