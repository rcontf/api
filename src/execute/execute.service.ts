import { Injectable } from '@nestjs/common';
import { ExecuteCommandDto } from './dto/execute.dto';
import Rcon from './rcon/rcon';

@Injectable()
export class ExecuteService {
  async execute(executeDto: ExecuteCommandDto): Promise<string | boolean> {
    const rconClient = new Rcon({
      host: executeDto.ip,
      port: executeDto.port ?? 27015,
      timeout: 2500,
      encoding: 'utf8',
    });

    try {
      await rconClient.authenticate(executeDto.password);
      const response = await rconClient.execute(executeDto.command);
      await rconClient.disconnect();
      return response;
    } catch (err) {
      return err;
    }
  }
}
