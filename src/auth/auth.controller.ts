import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from 'src/users/decorators/user.decorator';
import { UserEntity } from 'src/users/decorators/user.type';
import { Cookies } from './decorators/cookie.decorator';
import { JWTService } from './jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JWTService) {}

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
      expires: new Date(Date.now() + 12 * 3600000),
    });

    return {
      oldToken,
      newToken
    }
  }

  @Get('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.redirect('/');
  }
}
