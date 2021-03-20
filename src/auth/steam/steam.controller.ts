import { Controller, Get, Response, UseGuards } from '@nestjs/common';
import { Response as IExpressResponse } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JWTService } from '../jwt/jwt.service';
import { SteamStrategy } from './steam.strategy';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/decorators/user.decorator';
import { UserEntity } from 'src/users/decorators/user.type';

@Controller('auth/steam')
export class SteamController {
  constructor(
    private jwtService: JWTService,
    private configService: ConfigService,
    readonly steamStrategy: SteamStrategy,
  ) {}

  @UseGuards(AuthGuard('steam'))
  @Get()
  async redirect() {}

  @UseGuards(AuthGuard('steam'))
  @Get('/return')
  callback(@User() user: UserEntity, @Response() res: IExpressResponse) {
    const token = this.jwtService.login(user);
    res.cookie('token', token, {
      expires: new Date(Date.now() + 24 * 3600000 * 5),
      domain: this.configService.get('COOKIE_DOMAIN'),
    });
    res.redirect(this.configService.get('HOST'));
  }
}
