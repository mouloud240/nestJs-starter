import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly MailService: MailerService) {}
  sendEmail(to: string, subject: string, body: string): void {
    this.MailService.sendMail({
      to: to,
      subject: subject,
      text: body,
    })
      .then(() => {
        console.log('Email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }
  //More methods will be added later for templates manipulation
}
