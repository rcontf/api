import { Controller, Delete, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@User() user: UserEntity) {
    await this.userService.deleteUser(user.id);
  }
}
