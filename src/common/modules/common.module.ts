import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AlsModule } from './async_storage/als.module';

@Module({
  imports: [MailerModule, AlsModule],
  exports: [MailerModule, AlsModule],
})
export class CommonModule {}
