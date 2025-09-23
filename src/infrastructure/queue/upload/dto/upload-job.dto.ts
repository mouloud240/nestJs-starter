import { UploadingOptions } from 'src/infrastructure/cloudinary/types/upload-options.interface';

export class UploadJobDto {
  file: Express.Multer.File;
  options: UploadingOptions;
}
