import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MessageDto } from './dto/message.dto';
import { MessageType } from './enums/message-type.enum';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    const tokenPayload = this.authService.verifyToken(token);

    if (!tokenPayload) {
      client.emit('error', 'Unauthorized');
      client.disconnect(true);
      return;
    }

    const user = await this.usersService.findUserById(tokenPayload.id);
    client.data.user = user;
    client.emit('userData', user);

    const userConectedMessage: MessageDto = {
      type: MessageType.info,
      text: `${client.data.user.login} join to chat`,
    };
    client.broadcast.emit('message', userConectedMessage);
  }

  handleDisconnect(client: Socket) {
    const userConectedMessage: MessageDto = {
      type: MessageType.info,
      text: `${client.data.user.login} left the chat`,
    };
    client.broadcast.emit('message', userConectedMessage);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('message') message: string,
  ): void {
    this.server.emit('message', message);
  }
}
