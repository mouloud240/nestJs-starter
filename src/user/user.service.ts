import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateHash } from 'src/common/utils/authentication/bcrypt.utils';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  async getUserRole(userId: string): Promise<UserRole | undefined> {
    const role = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
      },
    });
    if (!role) {
      return undefined;
    }
    return role?.role;
  }
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(data: registerDto): Promise<User> {
    const hashedPassword = await generateHash(data.password);
    const createdUser = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: 'DONOR',
      },
    });
    return createdUser;
  }
  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
  findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
