import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @Get('/logout')
  logout(@Res() res: Response) {
    const redirectUrl = this.configService.get<string>('HOST');
    res.clearCookie('token');
    res.redirect(redirectUrl);
  }
}
