import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { USER } from 'src/authentication/decorators/user.decorartor';

@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User)
  me(@USER('id') id: string) {
    return this.userService.findById(id);
  }
}
