import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { OnlineUsersService } from './online-users.service';

@Module({
  imports: [AuthModule, UsersModule, MessagesModule],
  providers: [ChatGateway, OnlineUsersService],
})
export class ChatModule {}
