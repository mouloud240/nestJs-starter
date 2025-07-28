import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: 'ckvl1z9tr0000ybkdf8exd0a4',
    description: 'Unique identifier for the user',
  })
  id: string;

  @ApiProperty({ example: 'Mouloud', description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ example: 'Hasrane', description: 'Last name of the user' })
  lastName: string;

  @ApiProperty({
    example: '+213661234567',
    description: 'Phone number of the user in international format',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'mouloud@example.com',
    description: 'Unique email address of the user',
  })
  email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ORGANIZER,
    description: 'Role assigned to the user',
  })
  role: UserRole;

  @ApiProperty({
    example: '2025-07-18T10:00:00.000Z',
    description: 'Timestamp when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-18T12:00:00.000Z',
    description: 'Timestamp when the user was last updated',
  })
  updatedAt: Date;
}
