import { UseGuards } from '@nestjs/common';
import {
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
import { WsErrors } from './enums/ws-errors.enum';
import { OnlineUsersService } from './online-users.service';
import { WsAdminGuard } from './ws-admin.guard';
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private onlineUsersService: OnlineUsersService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    const tokenPayload = this.authService.verifyToken(token);

    if (!tokenPayload) {
      client.emit('error', WsErrors.unauthorized);
      client.disconnect(true);
      return;
    }

    const user = await this.usersService.findUserById(tokenPayload.id);
    client.data.user = user;
    client.emit('user-data', user);
    this.onlineUsersService.setUser(client.data.user.id, client);

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

    this.onlineUsersService.deleteUser(client.data.user.id);

    client.broadcast.emit('message', userConectedMessage);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody('message') message: string): void {
    this.server.emit('message', message);
  }

  @UseGuards(WsAdminGuard)
  @SubscribeMessage('toggle-mute')
  async handleToggleMute(@MessageBody('id') id: string): Promise<void> {
    const result = await this.usersService.toggleMute(id);

    const userClient = this.onlineUsersService.getUserSocket(id);

    if (userClient) {
      userClient.data.user.isMuted = result;

      const userToggleMuteMessage: MessageDto = {
        type: MessageType.info,
        text: `${userClient.data.user.login} is ${
          result ? 'muted' : 'unmuted'
        }`,
      };

      this.server.emit('message', userToggleMuteMessage);
    }
  }

  @UseGuards(WsAdminGuard)
  @SubscribeMessage('toggle-block')
  async handleToggleBlock(@MessageBody('id') id: string): Promise<void> {
    const userClient = this.onlineUsersService.getUserSocket(id);

    if (userClient) {
      const userBlockedMessage: MessageDto = {
        type: MessageType.info,
        text: `${userClient.data.user.login} is blocked`,
      };

      userClient.broadcast.emit('message', userBlockedMessage);

      userClient.disconnect(true);
    }
  }
}
