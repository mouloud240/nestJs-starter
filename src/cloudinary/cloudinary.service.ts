import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { Readable } from 'stream';

interface UploadingOptions {
  year: number;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    // Configure Cloudinary with credentials from environment variables
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadImage(
    fileBase64: string,
    options: UploadingOptions,
  ): Promise<cloudinary.UploadApiResponse> {
    try {
      const fileBuffer = Buffer.from(fileBase64, 'base64');
      const folder = options.year.toString();
      // Create a readable stream from the file buffer
      const stream = Readable.from(fileBuffer);

      this.logger.log('Upload to cloudinary');
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
              return reject(error);
            }
            if (!result) {
              this.logger.error('Upload failed: No result returned');
              return reject(new Error('No result returned from Cloudinary'));
            }
            this.logger.log(`Upload successful: ${JSON.stringify(result)}`);
            resolve(result);
          },
        );

        // Pipe the file buffer stream to Cloudinary
        stream.pipe(uploadStream);
      });
    } catch (e) {
      this.logger.error(`Upload failed: ${e.message}`, e.stack);
      throw e;
    }
  }
}
