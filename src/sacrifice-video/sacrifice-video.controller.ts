import { Controller } from '@nestjs/common';
import { SacrificeVideoService } from './sacrifice-video.service';

@Controller('sacrifice-video')
export class SacrificeVideoController {
  constructor(private readonly sacrificeVideoService: SacrificeVideoService) {}
}
