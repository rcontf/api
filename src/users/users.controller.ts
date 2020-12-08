import { Controller, Delete, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from './decorators/user.decorator';
import { UserEntity } from './decorators/user.type';
import { UserService } from './users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  getProfile(@User() user: UserEntity) {
    return user;
  }

  @Delete()
  async deleteProfile(@User() user: UserEntity, @Res() res: Response) {
    await this.userService.deleteUser(user.id);
    res.clearCookie('token');
    res.redirect('/');
  }
}
