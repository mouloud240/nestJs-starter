import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class LocalGuard extends AuthGuard('local') {
  constructor() {
    super();

  }
  getRequest(context: ExecutionContext) {
    const ctx=GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
