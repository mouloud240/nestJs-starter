import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/interfaces/app-config.interface';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mail = configService.get<AppConfig['mail']>('mail')!;
        return {
          transport: {
            host: mail.host,
            port: mail.port,
            secure: mail.secure,
            auth: mail.auth,
            tls: mail.tls,
          },
          defaults: mail.from ? { from: mail.from } : undefined,
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
