import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDocument } from 'src/users/schemas/user.schema';
import { User } from '../users/decorators/user.decorator';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { Cookies } from './decorators/cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('steam'))
  @Get('steam')
  redirect() {}

  @UseGuards(AuthGuard('steam'))
  @Get('steam/return')
  callback(
    @Cookies('returnUrl') returnUrl: string,
    @User() user: UserDocument,
    @Res() res: Response,
  ) {
    const token = this.authService.generateToken(user.id);

    const url: string = !!returnUrl
      ? returnUrl
      : this.configService.get('CLIENT_URL');

    if (returnUrl) res.redirect(`${url}/auth/success?token=${token}`);

    res.redirect(`${url}/auth/success?token=${token}`);
  }

  @Get('/refresh')
  @Auth()
  refresh(@Param('token') token: string, @User() user: UserDocument) {
    const oldToken = token;
    const newToken = this.authService.generateToken(user.id);

    return {
      oldToken,
      newToken,
    };
  }
}
