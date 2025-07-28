import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'nestjs-cloudinary';

@Injectable()
export class CloudinaryWrapperService {
  constructor(private readonly cloudService: CloudinaryService) {}
  async uploadImage(file: Express.Multer.File) {
    return this.cloudService.uploadFile(file);
  }
}
