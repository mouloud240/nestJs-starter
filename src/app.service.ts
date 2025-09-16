import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from './common/constants/queues';
import { InjectQueue } from '@nestjs/bullmq';
import { UploadJobDto } from './queue/upload/dto/upload-job.dto';
import { UploadingOptions } from './cloudinary/types/upload-options.interface';
import { UPLOAD_JOBS } from './common/constants/jobs';
/*
 * Since we are using graphql for this branch we cannot handle file uploads with form-data like rest before,
 * so Uploading the file on the request needed is not possible (rather not recommended for security and performance reasons),
 * so we will create a temporary endpoint to handle the file upload with form-data and return the job id  and
 * attachement metadata to the user,
 * so the user on next mutatition can just use the attachement id to link the attachement to any entity
 * and use the job id to track the upload progress if needed
 *
 * In the future we can implement a websocket gateway to notify the user when the upload is completed
 *
 * The uploadFile method will create an attachement in the database and return the id to the user
 *
 * If you have a better suggestion please open an issue or a pull request
 * */

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(QUEUE_NAME.UPLOAD) private readonly uploadQueue: Queue,
  ) {}

  /**
   * * Upload a file to the cloudinary on the background
   * * Create an attachement in the database and return the id to the user
   * * Return the job id to the user to track the upload progress if needed
   * @param file The file to be uploaded
   * @param options Uploading options
   * @returns The attachement metadata and job id
   * */

  async uploadFile(file: Express.Multer.File, options: UploadingOptions) {
    const data: UploadJobDto = {
      file,
      options,
    };
    // Create an attachement with the database and return the id to the user after the file upload
    const attachement = { id: 5 };
    // Add a job to the queues
    const job = await this.uploadQueue.add(UPLOAD_JOBS.UPLOAD_FILE, data);
    return { attachement, jobId: job.id };
  }
  getHello(): string {
    return 'Hello World!';
  }
}
