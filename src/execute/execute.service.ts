import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExecuteCommandDto } from './dto/execute.dto';
import Rcon from 'rcon-srcds';
import { RconResponse, RconErrorResponse } from './types/execute.type';

@Injectable()
export class ExecuteService {
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
}
