import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from 'src/users/decorators/user.decorator';
import { UserEntity } from 'src/users/decorators/user.type';
import { Cookies } from './decorators/cookie.decorator';
import { JWTService } from './jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JWTService,
    private configService: ConfigService,
  ) {}

  @Get('/refresh')
  @UseGuards(AuthGuard('jwt'))
  refresh(
    @Cookies('token') token: string,
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
  ) {
    const oldToken = token;
    const newToken = this.jwtService.login(user);

    res.cookie('token', newToken, {
      expires: new Date(Date.now() + 24 * 3600000 * 5),
      domain: this.configService.get('COOKIE_DOMAIN'),
    });

    return {
      oldToken,
      newToken,
    };
  }

  @Get('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.redirect(this.configService.get('HOST'));
  }
}
