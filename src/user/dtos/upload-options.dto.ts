import { IsEnum } from 'class-validator';

export class UploadOptionsDto {
  @IsEnum(['USER', 'OTHER'])
  uploadType: 'USER' | 'OTHER';
}
