import { Injectable } from '@nestjs/common';
import { result } from 'src/common/utils/result.util';
import { compareHash } from 'src/common/utils/authentication/bcrypt.utils';
import { err } from 'src/common/utils/result.util';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { tryCatch } from 'bullmq';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { registerDto } from './dtos/requests/register.dto';
import { ok } from 'assert';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<result<User, string>> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return err('User not found');
    }
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      return err('Invalid password');
    }
    return { ok: true, value: user };
  }
  async issueTokens(user: User): Promise<result<AuthResponseDto, string>> {
    try { 
      return {
        ok: true,
        value:{
          //TODO : add jwt token generation logic here
          accessToken: 'accessToken', // Replace with actual token generation logic
          refreshToken: 'refreshToken', // Replace with actual token generation logic
          user: user,
        }
      }
    } catch (error) {
      
      return err('Failed to issue tokens');
    }
  }
  async registerUser(data:registerDto){
    
    const user= await this.userService.createUser(data);
    if(user.ok === false){
      return err(user.error);
    }
    const tokens = await this.issueTokens(user.value);
    if(!tokens.ok){
      return err('Failed to issue tokens');
    }
    return ok({
      accessToken: tokens.value.accessToken,
      refreshToken: tokens.value.refreshToken,
      user: user.value
    }) 
  }

}
