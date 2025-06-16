export interface MailConfig {
  host: string;
  port: number;
  secure: boolean; // true for 465, false for other ports
  auth: {
    user: string;
    pass: string;
  };
  from?: string; // Optional, default sender email address
  tls?: {
    rejectUnauthorized?: boolean; // Optional, default is true
  };
}
