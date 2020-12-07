import { Controller, Get, Req, Response, UseGuards } from '@nestjs/common';
import { Request, Response as IExpressResponse } from "express";
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/steam')
export class SteamController {

    @UseGuards(AuthGuard('steam'))
    @Get()
    async redirect() {}

    @UseGuards(AuthGuard('steam'))
    @Get('/return')
    async callback(@Req() req: Request, @Response() res: IExpressResponse): Promise<void> {
        const user = req.user;
        res.send("auth'd");
    }
}
