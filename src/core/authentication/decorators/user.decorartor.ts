import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../types/extended-req.type';
import { User } from 'src/core/user/entities/user.entity';

export const USER = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendedRequest>();
    const user = request.user;
    if (!user) {
      throw new Error('User not found in request');
    }
    // If data is provided, return the specific property
    if (data) {
      return user[data];
    }

    // Otherwise, return the entire user object
    return user;
  },
);
