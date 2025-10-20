import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthenticationModule],
  exports: [UserModule, AuthenticationModule],
})
export class CoreModule {}
