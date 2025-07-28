import { PartialType } from '@nestjs/swagger';
import { CreateDonationDto } from './create-donation.dto';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {}
