import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;
  @Field()
  email: string;
  @Field()
  username: string;

  password: string;
  isMailVerified: boolean;
}
