import { MailerOptions } from '@nestjs-modules/mailer';

export interface MailConfig extends MailerOptions {
  template: {
    dir: string;
    adapter: any;
    options: {
      strict: boolean;
    };
  };
}
