import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { Readable } from 'stream';

import 'multer';
import cloudConfig from 'src/config/cloud.config';
import { UploadingOptions } from './types/upload-options.interface';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    @Inject(cloudConfig.KEY)
    private readonly cloudConfiguration: ConfigType<typeof cloudConfig>,
  ) {
    // Configure Cloudinary with credentials from environment variables
    // TODO: refactor this into new config style
    cloudinary.v2.config({
      cloud_name: this.cloudConfiguration.cloudName,
      api_key: this.cloudConfiguration.apiKey,

      api_secret: this.cloudConfiguration.apiSecret,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadingOptions,
  ): Promise<cloudinary.UploadApiResponse> {
    try {
      const time = new Date().getFullYear();
      const folder = `${options.uploadType.toLowerCase()}s/${time}/`;

      //NOTE: this is an issue with multer and cloudinary sdk types ignore it for now
      const buffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          Buffer.from((file.buffer as any).data);
      const stream = Readable.from([buffer]);
      this.logger.log(
        'Starting upload to Cloudinary...' + stream.readableLength,
      );
      // Return a promise to handle the upload_stream result
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: folder || undefined,

            resource_type: 'auto', // Automatically detect file type (image, video, etc.)
          },
          (
            error: cloudinary.UploadApiErrorResponse | undefined,
            result: cloudinary.UploadApiResponse | undefined,
          ) => {
            if (error) {
              this.logger.error(`Upload failed: ${error.message}`, error.stack);
              return reject(Error(error.message));
            }
            if (!result) {
              this.logger.error('Upload failed: No result returned');
              return reject(new Error('No result returned from Cloudinary'));
            }
            resolve(result);
          },
        );

        // Pipe the file buffer stream to Cloudinary
        stream.pipe(uploadStream);
      });
    } catch (e) {
      //TODO add better error handling
      this.logger.error(`Upload failed: ${e}`);
      throw e;
    }
  }
}
