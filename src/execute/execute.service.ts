import { Injectable } from '@nestjs/common';
import { ExecuteCommandDto } from './dto/create-execute.dto';

@Injectable()
export class ExecuteService {

  execute(executeDto: ExecuteCommandDto) {
    return 'This action adds a new execute';
  }
}
