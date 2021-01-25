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
  port: number;
}
@Injectable()
export class ExecuteService {
  private logger = new Logger(ExecuteService.name);
  private listeners: Map<string, Listeners> = new Map();
  private serverIp: string;

  constructor(configService: ConfigService) {
    this.serverIp = configService.get('SERVER_IP');
  }

  /**
   * Edits a logaddress
   * @param serverDetails Details of server
   * @param port port to assign
   * @param add Removing or adding this log address
   */
  private async editLogAddress(
    serverDetails: SubscribeServerDto,
    port: number,
    add: boolean = true,
  ) {
    return await this.execute({
      ip: serverDetails.ip,
      password: serverDetails.password,
      command: `logaddress_${add ? 'add' : 'del'} ${this.serverIp}:${port}`,
      port: serverDetails.port,
    } as ExecuteCommandDto);
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
    this.logger.log(`${id} subscribed`);

    if (this.listeners.has(id)) {
      return this.logger.warn(`${id} is subscribing twice. Ignoring.`);
    }

    await this.editLogAddress(serverDetails, 9871);
    
    const reciever = new LogReceiver();

    this.listeners.set(id, {
      reciever: reciever,
      server: serverDetails,
      port: 9871 // @TODO: Replace with random, free port
    });

    // Emit data to each consumer
    reciever.on('data', (data) =>
      client.emit(ExecuteSubscribedMessage.RECIEVED_DATA, data.message),
    );
  }

  async unsubscribe(id: string) {
    if (!this.listeners.has(id)) return;

    const listener = this.listeners.get(id);

    await this.editLogAddress(listener.server, listener.port, false);

    // Cleanup listeners, and close port to allow re-assignment
    listener.reciever.removeAllListeners();
    listener.reciever.socket.close();

    this.listeners.delete(id);
    this.logger.log('Removed ' + id);
  }
}
