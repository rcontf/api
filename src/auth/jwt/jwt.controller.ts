import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('my')
export class JwtController {

    @UseGuards(AuthGuard('jwt'))
    @Get("/profile")
    async profile(@Req() req: Request) {
        return req.user;
    }
}
