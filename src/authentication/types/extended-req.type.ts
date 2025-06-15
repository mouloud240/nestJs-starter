import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
export interface ExtendedRequest extends Request {
  user: User;
}
