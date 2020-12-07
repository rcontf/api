import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
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
  async createTest(
    @Body(new ValidationPipe({ transform: true })) createTestDto: CreateTestDto,
  ) {
    await this.testService.create(createTestDto);
  }
}
