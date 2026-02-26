import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard implements CanActivate {
  static validateToken(client: Socket) {
    const { authorization } = client.handshake.auth.authorization
      ? client.handshake.auth
      : client.handshake.headers;

    const token: string = authorization.split(' ')[1];
    const JWT_ACCESS_TOKEN_SECRET =
      process.env.JWT_ACCESS_TOKEN_SECRET || 'this-is-a-secret';

    return verify(token, JWT_ACCESS_TOKEN_SECRET);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();
    const payload = WsJwtGuard.validateToken(client);
    client.data.user = payload; // Attach user to socket
    return true;
  }
}
