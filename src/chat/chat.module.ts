import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { OnlineUsersService } from './online-users.service';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [ChatGateway, OnlineUsersService],
})
export class ChatModule {}
