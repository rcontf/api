import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Server, ServerSchema } from './schemas/server.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
  ],
  controllers: [ServersController],
  providers: [ServersService]
})
export class ServersModule {}
