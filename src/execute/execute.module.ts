import { Module } from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { ExecuteController } from './execute.controller';

@Module({
  controllers: [ExecuteController],
  providers: [ExecuteService]
})
export class ExecuteModule {}
