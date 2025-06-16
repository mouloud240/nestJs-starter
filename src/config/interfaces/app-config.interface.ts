import { MailConfig } from "./mail-config.inteface";

export interface AppConfig {
  redis: {
    host: string;
    port: number;
  };
  mail:MailConfig;
}
