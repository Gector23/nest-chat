import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class OnlineUsersService {
  private users = new Map<string, Socket>();

  setUser(userId: string, socket: Socket): void {
    this.users.set(userId, socket);
  }

  deleteUser(userId: string): void {
    this.users.delete(userId);
  }

  getUserSocket(userId: string): Socket {
    return this.users.get(userId);
  }

  getOnlineUsers(): UserDto[] {
    return Object.values(Object.fromEntries(this.users)).map(
      (socket: Socket) => socket.data.user,
    );
  }
}
