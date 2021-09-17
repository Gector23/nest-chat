import { UseGuards } from '@nestjs/common';
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
import { MessageType } from '../messages/enums/message-type.enum';
import { WsErrors } from './enums/ws-errors.enum';
import { OnlineUsersService } from './online-users.service';
import { WsAdminGuard } from './guards/ws-admin.guard';
import { WsMuteGuard } from './guards/ws-mute.guard';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';
import { MessagesService } from 'src/messages/messages.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private onlineUsersService: OnlineUsersService,
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    const tokenPayload = this.authService.verifyToken(token);

    if (!tokenPayload) {
      client.emit('error', WsErrors.unauthorized);
      client.disconnect(true);
      return;
    }

    client.data.user = await this.usersService.findUser({
      id: tokenPayload.id,
    });

    client.emit('user-data', plainToClass(UserDto, client.data.user));
    this.onlineUsersService.setUser(client.data.user.id, client);

    this.server.emit('online-users', this.onlineUsersService.getOnlineUsers());

    const userConectedMessage = await this.messagesService.createMessage(
      plainToClass(CreateMessageDto, {
        text: `${client.data.user.login} join to chat`,
        author: null,
        type: MessageType.info,
      }),
    );
    client.broadcast.emit('message', userConectedMessage);
  }

  async handleDisconnect(client: Socket) {
    this.onlineUsersService.deleteUser(client.data.user.id);

    const userConectedMessage = await this.messagesService.createMessage(
      plainToClass(CreateMessageDto, {
        text: `${client.data.user.login} left the chat`,
        author: null,
        type: MessageType.info,
      }),
    );

    client.broadcast.emit('message', userConectedMessage);
  }

  @UseGuards(WsMuteGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody('text') text: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userMessage = await this.messagesService.createMessage(
      plainToClass(CreateMessageDto, {
        text,
        author: client.data.user,
        type: MessageType.user,
      }),
    );

    this.server.emit('message', userMessage);
  }

  @SubscribeMessage('get-messages')
  async handleGetMessages(
    @MessageBody('currentPage') currentPage: number,
    @MessageBody('pageSize') pageSize: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const messages = await this.messagesService.getMessages(
      currentPage,
      pageSize,
    );

    client.emit('messages', messages);
  }

  @UseGuards(WsAdminGuard)
  @SubscribeMessage('toggle-mute')
  async handleToggleMute(@MessageBody('id') id: string): Promise<void> {
    const result = await this.usersService.toggleMute(id);

    const userClient = this.onlineUsersService.getUserSocket(id);

    if (userClient) {
      userClient.data.user.isMuted = result;

      const userToggleMuteMessage = await this.messagesService.createMessage(
        plainToClass(CreateMessageDto, {
          text: `${userClient.data.user.login} is ${
            result ? 'muted' : 'unmuted'
          }`,
          author: null,
          type: MessageType.info,
        }),
      );

      this.server.emit('message', userToggleMuteMessage);
    }
  }

  @UseGuards(WsAdminGuard)
  @SubscribeMessage('toggle-block')
  async handleToggleBlock(@MessageBody('id') id: string): Promise<void> {
    const userClient = this.onlineUsersService.getUserSocket(id);

    if (userClient) {
      const userBlockedMessage = await this.messagesService.createMessage(
        plainToClass(CreateMessageDto, {
          text: `${userClient.data.user.login} is blocked`,
          author: null,
          type: MessageType.info,
        }),
      );

      userClient.broadcast.emit('message', userBlockedMessage);

      userClient.disconnect(true);
    }
  }
}
