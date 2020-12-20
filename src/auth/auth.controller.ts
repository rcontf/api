import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.redirect('/');
  }
}
