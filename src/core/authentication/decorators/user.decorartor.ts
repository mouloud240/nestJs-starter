import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../types/extended-req.type';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';

export const USER = createParamDecorator(
  (data: keyof AccessTokenPayload['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendedRequest>();
    const {user} = request;
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
