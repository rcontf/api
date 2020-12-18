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
    private configService: ConfigService,
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
    const host = this.configService.get<string>('HOST');
    const token = await this.jwtService.login(req.user);
    const highLevelDomain = host.split('/')[2];
    const cookieDomain = highLevelDomain === 'localhost:3000' ? highLevelDomain.split(':3000')[0] : highLevelDomain;
    res.cookie('token', token, {
      domain: cookieDomain,
      expires: new Date(Date.now() + 12 * 3600000),
      sameSite: "none",
      httpOnly: true
    });
    res.redirect(host + '/success');
  }
}
