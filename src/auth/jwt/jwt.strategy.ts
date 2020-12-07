import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTConfigService } from './jwt.config';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly jwtConfigService: JWTConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies['token']]),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.createJwtOptions().secret,
    });
  }

  async validate(payload: any) {
    const user = this.userService.findUser(payload.id);

    if(!user) {
        throw new UnauthorizedException('Cannot find user.');
    }

    return user;
  }
}