import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTestDto } from './dto/test.dto';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get('/')
  async getAll() {
    return this.testService.findAll();
  }

  @Post('/')
  async createTest(@Body() createTestDto: CreateTestDto) {
    await this.testService.create(createTestDto);
  }
}
