import { Controller, Delete, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from './decorators/user.decorator';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  getProfile(@User() user: UserDocument) {
    return user;
  }

  @Delete()
  async deleteProfile(@User() user: UserDocument, @Res() res: Response) {
    await this.userService.deleteUser(user.id);
    res.clearCookie('token');
    res.redirect('/');
  }
}
