import { Controller, Post, Body } from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { ExecuteCommandDto } from './dto/create-execute.dto';

@Controller('execute')
export class ExecuteController {
  constructor(private readonly executeService: ExecuteService) {}

  @Post()
  create(@Body() createExecuteDto: ExecuteCommandDto) {
    return this.executeService.execute(createExecuteDto);
  }
}
