import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from '../auth/services/auth.service';
import { ExtendedSocket } from './types/socket';
import { Server, Socket } from 'socket.io';
import { SocketIoEnums } from '@newmbani/types';

@WebSocketGateway()
export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  protected server: Server;

  protected readonly logger = new Logger(BaseGateway.name);
  protected userSockets = new Map<string, string[]>();

  constructor(protected readonly authService: AuthService) {}

  /** 🔌 Handle user connection & join their room */
  async handleConnection(@ConnectedSocket() client: ExtendedSocket) {
    try {
      const user = await this.authService.authenticateSocket(client);
      if (!user) {
        // client.disconnect();
        this.logger.warn('❌ Unauthorized socket connection');
        return;
      }

      const userId = user._id.toString();
      const sockets = this.userSockets.get(userId) || [];
      sockets.push(client.id);
      this.userSockets.set(userId, sockets);
      await client.join(userId);

      client.data.user = user;
      this.logger.log(`✅ User ${userId} connected [${client.id}]`);
    } catch (err) {
      this.logger.error('❌ Connection error:', err);
      client.disconnect();
    }
  }

  /** 🔌 Handle disconnect */
  handleDisconnect(client: Socket): void {
    this.logger.log(`🔌 Client disconnected: ${client.id}`);
    for (const [userId, sockets] of this.userSockets.entries()) {
      const updated = sockets.filter((id) => id !== client.id);
      if (updated.length !== sockets.length) {
        if (updated.length > 0) this.userSockets.set(userId, updated);
        else this.userSockets.delete(userId);
        this.logger.log(`❌ User ${userId} disconnected [${client.id}]`);
        break;
      }
    }
    client.removeAllListeners();
  }

  /** 📤 Send data to all sockets belonging to a user */
  async notifyUser(data: {
    userId: string;
    topic: SocketIoEnums;
    payload: any;
  }) {
    const { userId, topic, payload } = data;
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.length === 0) {
      this.logger.warn(`⚠️ No active socket for user ${userId}`);
      return;
    }

    console.log({ notifyUser: sockets });

    for (const id of sockets) {
      const client = await this.getSocketById(id, userId);
      if (client) client.emit(topic, payload);
    }

    this.logger.log(`📤 Notified user ${userId}`);
  }

  /** 🧩 Helper to find socket instance by ID */
  protected async getSocketById(socketId: string, userId: string) {
    const sockets = await this.server.in(userId).fetchSockets();
    return sockets.find((s) => s.id === socketId);
  }
}
