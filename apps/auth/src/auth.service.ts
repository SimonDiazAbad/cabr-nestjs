import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from './users/models/users.schema';
import { TokenPayload } from './interfaces/token-payload.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    console.log(`Userid in login: ${user._id}`);
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const signedToken = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', signedToken, {
      httpOnly: true,
      expires,
    });
  }
}
