import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from './users/models/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: parseInt(user._id.toString(), 16),
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
