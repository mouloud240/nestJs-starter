import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { ExtendedRequest } from "../types/extended-req.type";

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
)
