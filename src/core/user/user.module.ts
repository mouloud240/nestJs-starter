import { Module } from '@nestjs/common';
import { UserController } from './v1/user.controller';
import { UserService } from './v1/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
