import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Server, ServerSchema } from 'src/servers/schemas/server.schema';
import { ServersService } from 'src/servers/servers.service';
import { LogsService } from './logs.service';
import { Logs, LogsSchema } from './schemas/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Server.name, schema: ServerSchema },
      { name: Logs.name, schema: LogsSchema },
    ]),
  ],
  providers: [LogsService, ServersService],
})
export class LogsModule {}
