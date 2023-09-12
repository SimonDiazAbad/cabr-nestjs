import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { validate } from 'class-validator';
import { string } from 'joi';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      usernamefield: 'email',
    });

    async validate(email: string, password: string){
      return this.usersService.validateUser(email, password);
    }
  }
}
