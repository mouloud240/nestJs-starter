import { Request } from 'express';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
export interface ExtendedRequest extends Request {
  user: AccessTokenPayload;
}
