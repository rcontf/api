import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { ExecuteCommandDto } from './dto/execute.dto';
import { Response } from 'express';

@Controller('execute')
@UsePipes(new ValidationPipe({ transform: true, disableErrorMessages: true }))
export class ExecuteController {
  constructor(private executeService: ExecuteService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async execute(
    @Body() executeBody: ExecuteCommandDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.executeService.execute(executeBody);
    if ('error' in response) {
      res.status(HttpStatus.BAD_REQUEST);
    }
    return response;
  }
}
