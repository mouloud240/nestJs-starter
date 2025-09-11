import { MailerOptions } from '@nestjs-modules/mailer';

export interface MailConfig {
  port: number;
  host: string;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  template: {
    dir: string;
    adapter: any;
    options: {
      strict: boolean;
    };
  };
}

