import {
  Body,
  Controller,
  Patch,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UpdateDto } from './dto/update.dto';
import { UpdateService } from './update.service';

@Controller('update')
@UsePipes(new ValidationPipe({ transform: true, disableErrorMessages: true }))
export class UpdateController {
  constructor(
    private updateService: UpdateService,
    private configService: ConfigService,
  ) {}

  @Patch('/tf2')
  updateTf2(@Body() updateDto: UpdateDto, @Res() res: Response) {
    // if (updateDto.secret !== this.configService.get('UPDATE_SECRET'))
    //   return res.status(401);

    // return this.updateService.newUpdate(updateDto.type);
  }
}
