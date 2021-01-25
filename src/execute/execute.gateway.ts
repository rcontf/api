import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import SubscribedMessage from './enums/socket.messages';
import { ExecuteService } from './execute.service';

@WebSocketGateway({
  namespace: 'dashboard',
})
export class ExecuteGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ExecuteGateway.name);

  constructor(private readonly executeService: ExecuteService) {}

  afterInit(server: Server) {
    this.logger.log('Dashboard Subscriber active');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('New connection: ' + client.id);
  }

  handleDisconnect(client: Socket): void {
    this.executeService.unsubscribe(client.id);
  }

  @SubscribeMessage(SubscribedMessage.SUBSCRIBE)
  handleSubscription(client: Socket, serverIp: string): WsResponse<boolean> {
    this.executeService.subscribe(client.id, client);

    return { event: SubscribedMessage.SUBSCRIBE_FULFILLED, data: true };
  }

  @SubscribeMessage(SubscribedMessage.UNSUBSCRIBE)
  handleUnsubscription(client: Socket): WsResponse<boolean> {
    this.executeService.unsubscribe(client.id);

    return { event: SubscribedMessage.UNSUBSCRIBE_FULFILLED, data: true };
  }
}
