import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { SacrificeStatus } from '@prisma/client';

export class CreateSacrificeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  donorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sacrificeVideoId: string;

  @ApiProperty({ enum: SacrificeStatus })
  @IsEnum(SacrificeStatus)
  @IsNotEmpty()
  status: SacrificeStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year: number;
}
