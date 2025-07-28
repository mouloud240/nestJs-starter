import { PartialType } from '@nestjs/swagger';
import { CreateSacrificerSacrificesCountDto } from './create-sacrificer-sacrifices-count.dto';

export class UpdateSacrificerSacrificesCountDto extends PartialType(
  CreateSacrificerSacrificesCountDto,
) {}
