import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ExecuteCommandDto } from './dto/execute.dto';
import Rcon from 'rcon-srcds';
import { RconResponse, RconErrorResponse } from './types/execute.type';
import { LogReceiver } from 'better-srcds-log-receiver';
import { ExecuteGateway } from './execute.gateway';
import { Socket } from 'socket.io';
import ExecuteSubscribedMessage from './enums/socket.messages';

@Injectable()
export class ExecuteService {
  private logger = new Logger(ExecuteService.name);
  private listeners: Map<string, LogReceiver> = new Map();

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

  subscribe(id: string, client: Socket) {
    this.logger.log(`${id} is subscribing to events.`);

    if (!this.listeners.has(id)) {
      this.listeners.set(id, new LogReceiver());
      this.listeners.get(id).on('data', (data) => {
        client.emit(ExecuteSubscribedMessage.RECIEVED_DATA, data.message);
      });
    } else {
      this.listeners.get(id).on('data', (data) => {
        client.emit(ExecuteSubscribedMessage.RECIEVED_DATA, data.message);
      });
    }
  }

  unsubscribe(id: string) {
    this.logger.log(`${id} is unsubscribing.`);
    if (!this.listeners.has(id)) return;

    this.listeners.get(id).removeAllListeners();
    this.listeners.delete(id);
  }
}
