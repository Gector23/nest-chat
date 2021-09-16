import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsErrors } from '../enums/ws-errors.enum';

@Injectable()
export class WsMuteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();

    const isMuted = client.data.user.isMuted;

    if (isMuted) {
      client.emit('error', WsErrors.forbidden);
    }

    return !isMuted;
  }
}
