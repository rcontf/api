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
      expires: new Date(Date.now() + 12 * 3600000),
    });
    res.redirect('/');
  }
}
