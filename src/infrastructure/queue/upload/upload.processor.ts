import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UPLOAD_JOBS } from 'src/common/constants/jobs';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { UploadJobDto } from './dto/upload-job.dto';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';

@Processor(QUEUE_NAME.UPLOAD)
export class UploadProcessor extends WorkerHost {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }
  process(job: Job<UploadJobDto>, token?: string): Promise<any> {
    switch (job.name) {
      case UPLOAD_JOBS.UPLOAD_FILE:
        return this.cloudinaryService.uploadFile(
          job.data.file,
          job.data.options,
        );
      case UPLOAD_JOBS.DELETE_FILE:
        throw new Error('Method not implemented.');
      default:
        return Promise.resolve({
          message: 'Upload job processed',
          jobId: job.id,
        });
    }
  }
}
