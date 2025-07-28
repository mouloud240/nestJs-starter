import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { ExtendedRequest } from '../types/extended-req.type';
import { UserRole } from '@prisma/client';
import { rolesKey } from '../decorators/role.decorator';
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ExtendedRequest>();

    const roles = this.reflector.getAllAndOverride<UserRole[]>(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length == 0) {
      return true;
    }

    const userRole = await this.userService.getUserRole(req.user.id);
    if (!userRole) {
      return false;
    }

    return this.checkOverlap(roles, userRole);
  }
  checkOverlap(roles: UserRole[], role: UserRole): boolean {
    return roles.includes(role);
  }
}
