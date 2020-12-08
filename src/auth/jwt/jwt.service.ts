import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { steamid: user.id, sub: user.id, avatar: user.avatar };
    return this.jwtService.sign(payload, { expiresIn: '1w' });
  }
}
