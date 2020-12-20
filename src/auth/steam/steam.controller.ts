import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { Request, Response as IExpressResponse } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JWTService } from '../jwt/jwt.service';
import { SteamStrategy } from './steam.strategy';
import { ConfigService } from '@nestjs/config';

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
  async callback(
    @Req() req: Request,
    @Response() res: IExpressResponse,
  ): Promise<void> {
    const token = await this.jwtService.login(req.user);
    res.cookie('token', token, {
      expires: new Date(Date.now() + 12 * 3600000),
    });
    res.redirect('/success');
  }
}
