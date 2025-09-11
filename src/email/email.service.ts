import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  logger = new Logger(EmailService.name);
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: to,
        subject: subject,
        text: body,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Email Verification',
        template: './verification',
        context: {
          code,
        },
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error('Error sending verification email:', error);
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Password Reset',
        template: './password-reset',
        context: {
          token,
        },
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error('Error sending password reset email:', error);
    }
  }
}
