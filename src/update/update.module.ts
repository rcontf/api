import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UpdateController],
  providers: [UpdateService, ConfigService],
})
export class UpdateModule {}
