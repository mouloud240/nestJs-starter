import { SetMetadata } from '@nestjs/common';
import { userRole } from 'generated/prisma';

export const rolesKey = 'Roles';
export const Roles = (...roles: userRole[]) => SetMetadata(rolesKey, roles);
