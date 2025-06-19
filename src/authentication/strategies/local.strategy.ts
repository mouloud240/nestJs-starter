import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationService } from '../authentication.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'email', // The field in the request body that contains the email
      passwordField: 'password',
      passReqToCallback: true, // Allows us to access the request object
    });
  }
  async validate(req: Request, email: string, password: string): Promise<User> {
    const result = await this.authenticationService.validateUser(
      email,
      password,
    );
    if (result.ok) {
      return result.value; // Return the user object if validation is successful
    } else {
      throw new UnauthorizedException(result.error); // Throw an error if validation fails
    }
  }
}
