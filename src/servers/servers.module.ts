import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Server, ServerSchema } from './schemas/server.schema';
import { LogsService } from 'src/logs/logs.service';
import { Logs, LogsSchema } from 'src/logs/schemas/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Server.name, schema: ServerSchema },
      { name: Logs.name, schema: LogsSchema },
    ]),
  ],
  controllers: [ServersController],
  providers: [ServersService, LogsService],
})
export class ServersModule {}
