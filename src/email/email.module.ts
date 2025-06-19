import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/interfaces/app-config.interface';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const emailConfig = configService.get<AppConfig['mail']>('mail')!;

        return {
          transport: {
            host: emailConfig.host, // SMTP server host
            port: emailConfig.port, // SMTP server port
            secure: emailConfig.secure, // Use TLS if true
            auth: {
              user: emailConfig.auth.user, // SMTP username
              pass: emailConfig.auth.pass, // SMTP password
            },
          },
          defaults: {
            from: `"No Reply" <${process.env.EMAIL_FROM}>`, // Default sender address
          },
        };
      },
      inject: [ConfigService], // Inject ConfigService to access configuration
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
