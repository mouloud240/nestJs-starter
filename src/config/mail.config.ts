import { registerAs } from '@nestjs/config';
import { MailConfig } from './interfaces/mail-config.inteface';
import { join } from 'path';

export default registerAs(
  'mail',
  (): MailConfig => ({
    port: parseInt(process.env.MAIL_PORT!, 10) || 587,
    host: process.env.MAIL_HOST || 'smtp.example.com',
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER!,
      pass: process.env.MAIL_PASS!,
    },
    template: {
      dir: join(__dirname, '../email/templates'),
      adapter: new (require('handlebars').Adapter)(),
      options: {
        strict: true,
      },
    },
  }),
);
