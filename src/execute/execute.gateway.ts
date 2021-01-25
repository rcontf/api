import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import SubscribedMessage from './enums/socket.messages';
import { ExecuteService } from './execute.service';
import { SubscribeServerDto } from './dto/subscribe.dto';

@WebSocketGateway({
  namespace: '/dashboard',
})
export class ExecuteGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ExecuteGateway.name);

  constructor(private readonly executeService: ExecuteService) {}

  afterInit(server: Server) {
    this.logger.log('Dashboard Subscriber active');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('Connected: ' + client.handshake.address);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.executeService.unsubscribe(client.id);
    this.logger.log('Disconnected: ' + client.handshake.address);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage(SubscribedMessage.SUBSCRIBE)
  async handleSubscription(
    client: Socket,
    data: unknown,
  ): Promise<WsResponse<boolean>> {
    await this.executeService.subscribe(
      client.id,
      client,
      data as SubscribeServerDto,
    );

    return { event: SubscribedMessage.SUBSCRIBE_FULFILLED, data: true };
  }

  @SubscribeMessage(SubscribedMessage.UNSUBSCRIBE)
  async handleUnsubscription(client: Socket): Promise<WsResponse<boolean>> {
    await this.executeService.unsubscribe(client.id);

    return { event: SubscribedMessage.UNSUBSCRIBE_FULFILLED, data: true };
  }
}
