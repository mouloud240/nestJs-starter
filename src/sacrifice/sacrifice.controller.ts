import { Controller } from '@nestjs/common';
import { SacrificeService } from './sacrifice.service';

@Controller('sacrifice')
export class SacrificeController {
  constructor(private readonly sacrificeService: SacrificeService) {}
}
