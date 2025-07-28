import { PartialType } from '@nestjs/swagger';
import { CreateSacrificeDto } from './create-sacrifice.dto';

export class UpdateSacrificeDto extends PartialType(CreateSacrificeDto) {}
