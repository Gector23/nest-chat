import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsErrors } from './enums/ws-errors.enum';

@Injectable()
export class WsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();

    const isAdmin = client.data.user.isAdmin;

    if (!isAdmin) {
      client.emit('error', WsErrors.forbidden);
    }

    return isAdmin;
  }
}
