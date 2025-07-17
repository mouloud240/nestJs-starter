import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_JOBS } from 'src/common/constants/jobs';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { EmailService } from 'src/email/email.service';
import { SendMailDto } from './dtos/send-mail.dto';
import { Logger } from '@nestjs/common';

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
        break;
      default:
        return Promise.resolve();
    }
  }
  handleSendMailJob(job: Job<SendMailDto>): Promise<void> {
    const { to, subject, body } = job.data;
    return this.mailService.sendEmail(to, subject, body);
  }
}
