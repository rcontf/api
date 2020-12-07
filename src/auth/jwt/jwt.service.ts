import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  async login(user: UserDocument) {
    const payload = { steamid: user.id, sub: user.id, avatar: user.avatar };
    return this.jwtService.sign(payload, { expiresIn: '60s' });
  }
}
