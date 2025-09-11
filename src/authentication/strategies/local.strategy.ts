import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationService } from '../authentication.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'email', //change this to 'username' if you want to use username instead of email
      passwordField: 'password',
      passReqToCallback: true, // Allows us to access the request object
    });
  }
  async validate(email: string, password: string): Promise<User> {
    const result = await this.authenticationService.validateUser(
      email,
      password,
    );
    return result;
  }
}
