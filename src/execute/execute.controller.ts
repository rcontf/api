import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { ExecuteCommandDto } from './dto/execute.dto';

@Controller('execute')
@UsePipes(new ValidationPipe({ transform: true, disableErrorMessages: true }))
export class ExecuteController {
  constructor(private executeService: ExecuteService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async execute(@Body() executeBody: ExecuteCommandDto) {
    const response = await this.executeService.execute(executeBody);
    return response;
  }
}
