import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import SubscribedMessage from './enums/socket.messages';

@WebSocketGateway()
export class ExecuteGateway implements OnGatewayInit {
  private logger = new Logger(ExecuteGateway.name);

  afterInit(server: Server) {
    this.logger.log("WS Server listening");
  }

  @SubscribeMessage(SubscribedMessage.MESSAGE)
  handleMessage(client: Socket, text: string): WsResponse<string> {
    return { event: 'messageReply', data: text };
  }
}
