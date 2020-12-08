import { Controller, Post, Body } from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { ExecuteCommandDto } from './dto/execute.dto';

@Controller('execute')
export class ExecuteController {
  constructor(private executeService: ExecuteService) {}

  @Post()
  async execute(@Body() executeBody: ExecuteCommandDto) {
    const response = await this.executeService.execute(executeBody);
    return response;
  }
}
