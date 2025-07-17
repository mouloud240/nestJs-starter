import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  logger = new Logger(EmailService.name);
  constructor(private readonly MailService: MailerService) {}
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.MailService.sendMail({
        to: to,
        subject: subject,
        text: body,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  //More methods will be added later for templates manipulation
}
