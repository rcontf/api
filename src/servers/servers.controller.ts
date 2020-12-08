import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/decorators/user.decorator';
import { UserEntity } from 'src/users/decorators/user.type';
import { CreateServerDto } from './dto/create-server.dto';
import { DeleteServerDto } from './dto/delete-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersService } from './servers.service';

@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe({ transform: true, disableErrorMessages: true }))
@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get()
  async getAllServers(@User() user: UserEntity) {
    return this.serversService.getUserServers(user.id);
  }

  @Post()
  async createServer(
    @User() user: UserEntity,
    @Body()
    createServerDto: CreateServerDto,
  ) {
    return this.serversService.createServer(user.id, createServerDto);
  }

  @Delete(':ip')
  async deleteServer(
    @Param() params: DeleteServerDto,
    @User() user: UserEntity,
  ) {
    await this.serversService.deleteServer(params.ip, user.id);
  }

  @Patch(':ip')
  async updateServer(
    @Param('ip') ip: string,
    @Body() serverBody: UpdateServerDto,
  ) {
    return await this.serversService.updateServer(ip, serverBody);
  }
}
