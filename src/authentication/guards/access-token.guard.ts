import { AuthGuard } from '@nestjs/passport';

export class AcessTokenGuard extends AuthGuard('access-token') {
  constructor() {
    super();
  }
}
