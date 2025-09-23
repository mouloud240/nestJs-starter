import { RenameKey } from 'src/common/types/rename-key.type';
import { User } from 'src/core/user/entities/user.entity';

export interface AccessTokenPayload {
  user: RenameKey<User, 'id', 'sub'> ;
  metadata:any
}


