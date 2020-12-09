import { Injectable } from '@nestjs/common';
import { ExecuteCommandDto } from './dto/execute.dto';
import Rcon from './rcon/rcon';
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
        body: response,
      };
    } catch (err) {
      switch (err.code) {
        case RconErrorResponse.REFUSED:
          return {
            error: 'Could not connect',
          };
        default:
          return {
            error: err,
          };
      }
    }
  }
}
