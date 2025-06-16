import { AuthConfig } from './auth-config.interface';
import { MailConfig } from './mail-config.inteface';

export interface AppConfig {
  redis: {
    host: string;
    port: number;
  };
  mail: MailConfig;
  auth: AuthConfig;
}
