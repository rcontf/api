import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServersService } from 'src/servers/servers.service';
import { Logs, LogsDocument } from './schemas/log.schema';
import { ActionType } from './types/action.type';

@Injectable()
export class LogsService {
  constructor(
    private serversService: ServersService,
    @InjectModel(Logs.name)
    private logsModel: Model<LogsDocument>,
  ) {}

  private async getServer(ip: string) {
    return await this.serversService.getServer(ip);
  }

  async createLog(ip: string, actor: string, action: ActionType) {
    const server = await this.getServer(ip);

    if (!server) return null;

    server.logs.push(
      new this.logsModel({
        actor,
        action,
      }),
    );

    await server.save();

    return server;
  }

  async getLogsFromServer(ip: string) {
    return (await this.getServer(ip)).logs;
  }
}
