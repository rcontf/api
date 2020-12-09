import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Server, ServerDocument } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name)
    private severModel: Model<ServerDocument>,
  ) {}

  async getServer(ip: string) {
    return await this.severModel.findOne({ ip: ip });
  }

  async getUserServers(steamId: string) {
    return await this.severModel.find({ owner: steamId });
  }

  async createServer(steamId: string, serverDto: CreateServerDto) {
    const userServers = await this.getUserServers(steamId);

    const doesUserHaveServer = userServers.find(
      (server) => server.ip === serverDto.ip,
    );

    if (doesUserHaveServer) return false;

    if (userServers.length >= 3) return false;

    const newServer = new this.severModel({
      owner: steamId,
      hostname: serverDto.hostname ?? serverDto.ip,
      ip: serverDto.ip,
      password: serverDto.password,
      port: serverDto.port,
      type: serverDto.type,
    });

    await newServer.save();

    return newServer;
  }

  async deleteServer(ip: string, steamId: string) {
    const userServers = await this.getUserServers(steamId);

    const doesUserHaveServer = userServers.find((server) => server.ip === ip);

    if (!doesUserHaveServer) return false;

    return await this.severModel.findOneAndDelete({ ip: ip });
  }

  async updateServer(ip: string, server: UpdateServerDto) {
    const foundServer = await this.getServer(ip);

    if (!foundServer) return false;

    await foundServer.updateOne(server);

    return true;
  }
}
