import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTConfigService } from './jwt.config';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly jwtConfigService: JWTConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        console.log(req.cookies['token'] ?? "No token");
        console.log(req.headers)
        return req.cookies['token']
      },]),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.createJwtOptions().secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUser(payload.steamid);

    if(!user) {
        throw new UnauthorizedException('Cannot find user.');
    }

    return user;
  }
}