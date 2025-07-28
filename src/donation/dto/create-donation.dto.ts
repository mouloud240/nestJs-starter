import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, Min } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({ description: 'The number of sheeps he intends to donate' })
  @IsNumber()
  @Min(1)
  quanitity: number;
  @ApiProperty({
    description:
      'The year on which he want to donate it should be the current year',
  })
  @Transform(() => Date)
  @IsDate()
  year: Date;
}
