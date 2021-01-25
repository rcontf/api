import { Module } from '@nestjs/common';
import { ExecuteService } from './execute.service';
import { ExecuteController } from './execute.controller';
import { ExecuteGateway } from './execute.gateway';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ExecuteController],
  providers: [ExecuteService, ExecuteGateway, ConfigService],
})
export class ExecuteModule {}
