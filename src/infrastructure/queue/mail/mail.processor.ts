import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_JOBS } from 'src/common/constants/jobs';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { EmailService } from 'src/email/email.service';
import { SendMailDto } from './dtos/send-mail.dto';
import { Logger } from '@nestjs/common';
import { SendVerificationMailDto } from './dtos/send-verification-mail.dto';
import { SendPasswordResetMailDto } from './dtos/send-password-reset-mail.dto';

@Processor(QUEUE_NAME.MAIL)
export class MailProcessor extends WorkerHost {
  logger = new Logger(MailProcessor.name);
  constructor(private readonly mailService: EmailService) {
    super();
  }
  process(job: Job): Promise<any> {
    switch (job.name) {
      case MAIL_JOBS.SEND_MAIL:
        this.logger.log('Processing Sending mail job');
        return this.handleSendMailJob(job as Job<SendMailDto>);
      case MAIL_JOBS.SEND_VERIFICATION_MAIL:
        this.logger.log('Processing Sending verification mail job');
        return this.handleSendVerificationMailJob(
          job as Job<SendVerificationMailDto>,
        );
      case MAIL_JOBS.SEND_PASSWORD_RESET_MAIL:
        this.logger.log('Processing Sending password reset mail job');
        return this.handleSendPasswordResetMailJob(
          job as Job<SendPasswordResetMailDto>,
        );
      default:
        return Promise.resolve();
    }
  }
  handleSendMailJob(job: Job<SendMailDto>): Promise<void> {
    const { to, subject, body } = job.data;
    return this.mailService.sendEmail(to, subject, body);
  }

  handleSendVerificationMailJob(
    job: Job<SendVerificationMailDto>,
  ): Promise<void> {
    const { to, code } = job.data;
    return this.mailService.sendVerificationEmail(to, code);
  }

  handleSendPasswordResetMailJob(
    job: Job<SendPasswordResetMailDto>,
  ): Promise<void> {
    const { to, token } = job.data;
    return this.mailService.sendPasswordResetEmail(to, token);
  }
}
