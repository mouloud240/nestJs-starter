import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../types/extended-req.type';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { GqlExecutionContext } from '@nestjs/graphql';

export const USER = createParamDecorator(
  (data: keyof AccessTokenPayload['user'], ctx: ExecutionContext) => {
    const user = GqlExecutionContext.create(ctx).getContext().req
      .user as AccessTokenPayload['user'];
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
