import { Inject, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@Inject('JWT_SECRET') private key: string) {}

  generateToken(id: string) {
    return sign({ id }, this.key, { expiresIn: '1w' });
  }
}
