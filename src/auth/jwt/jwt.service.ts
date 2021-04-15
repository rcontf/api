import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/decorators/user.type';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  login(user: UserEntity) {
    const payload = { steamid: user.id, sub: user.id, avatar: user.avatar };
    return this.jwtService.sign(payload, { expiresIn: '1w' });
  }
}
