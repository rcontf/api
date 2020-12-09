import { Injectable } from '@nestjs/common';
import { ServerType } from 'src/servers/schemas/server.schema';

@Injectable()
export class UpdateService {
  private updateServer() {}

  newUpdate(type: ServerType) {
    switch (type) {
      case 'tf2':
        //new tf2 update, get subscribers and do something
        break;
    }
  }
}
