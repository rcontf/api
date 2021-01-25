import { Module } from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { ExecuteController } from './execute.controller';
import { ExecuteGateway } from './execute.gateway';

@Module({
  controllers: [ExecuteController],
  providers: [ExecuteService, ExecuteGateway]
})
export class ExecuteModule {}
