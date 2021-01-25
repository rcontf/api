import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ExecuteCommandDto } from './dto/execute.dto';
import Rcon from 'rcon-srcds';
import { RconResponse, RconErrorResponse } from './types/execute.type';
import { LogReceiver } from 'better-srcds-log-receiver';
import { Socket } from 'socket.io';
import * as gp from 'get-port';
import ExecuteSubscribedMessage from './enums/socket.messages';
import { ConfigService } from '@nestjs/config';
import { SubscribeServerDto } from './dto/subscribe.dto';
import { WsException } from '@nestjs/websockets';

interface Listeners {
  reciever: LogReceiver;
  server: SubscribeServerDto;
}
@Injectable()
export class ExecuteService {
  private logger = new Logger(ExecuteService.name);
  private listeners: Map<string, Listeners> = new Map();

  private serverIp: string;
  constructor(public configService: ConfigService) {
    this.serverIp = configService.get('SERVER_IP');
  }

  async execute(executeDto: ExecuteCommandDto): Promise<RconResponse> {
    const rconClient = new Rcon({
      host: executeDto.ip,
      port: executeDto.port,
      timeout: 2500,
      encoding: 'utf8',
    });

    try {
      await rconClient.authenticate(executeDto.password);
      const response = await rconClient.execute(executeDto.command);
      await rconClient.disconnect();

      return {
        body: response.toString(),
      };
    } catch (err) {
      // Catch if the error was from RCON library
      if (err.toString() == RconErrorResponse.UNAUTHENTICATED)
        throw new BadRequestException(
          'Check your RCON password',
          'Bad RCON password',
        );

      // Catch other errors from the RCON library / promise errors
      switch (err.code) {
        case RconErrorResponse.NOT_FOUND:
        case RconErrorResponse.REFUSED:
          throw new BadRequestException(
            'Check the IP or port of the server',
            'Could not connect to server',
          );

        default:
          throw new InternalServerErrorException('Could not reach server');
      }
    }
  }

  async subscribe(
    id: string,
    client: Socket,
    serverDetails: SubscribeServerDto,
  ) {
    this.logger.log(`${id} subscribing, sending command..`);

    await this.execute({
      ip: serverDetails.ip,
      password: serverDetails.password,
      command: `logaddress_add ${this.serverIp}:9871`,
      port: serverDetails.port,
    } as ExecuteCommandDto);

    if (!this.listeners.has(id)) {
      this.logger.log('Creating logger...');
      const reciever = new LogReceiver();

      this.logger.log('Adding logger...');

      this.listeners.set(id, {
        reciever: reciever,
        server: serverDetails,
      });

      this.logger.log('Setting up listeners...');

      reciever.on('data', (data) => {
        this.logger.debug(data.message);
        client.emit(ExecuteSubscribedMessage.RECIEVED_DATA, data.message);
      });
    } else {
      this.logger.error('This should never happen here.');
      throw new WsException('Hit unwanted point');
    }
  }

  async unsubscribe(id: string) {
    if (!this.listeners.has(id)) return;

    const listener = this.listeners.get(id);

    await this.execute({
      ip: listener.server.ip,
      password: listener.server.password,
      command: `logaddress_del ${this.serverIp}:9871`,
      port: listener.server.port,
    } as ExecuteCommandDto);

    this.listeners.get(id).reciever.removeAllListeners();
    this.listeners.delete(id);
  }
}
