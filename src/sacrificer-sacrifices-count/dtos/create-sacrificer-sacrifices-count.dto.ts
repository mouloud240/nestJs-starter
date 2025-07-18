import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSacrificerSacrificesCountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sacrificerId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  doneCount: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year: number;
}
