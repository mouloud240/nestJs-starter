import { ApiProperty } from '@nestjs/swagger';

export class DonationResponseDto {
  @ApiProperty({ description: 'The ID of the donation' })
  id: string;

  @ApiProperty({ description: 'The quantity of the donation' })
  quanitity: number;

  @ApiProperty({ description: 'The year of the donation' })
  year: Date;

  @ApiProperty({ description: 'The ID of the user who made the donation' })
  userId: string;
}
