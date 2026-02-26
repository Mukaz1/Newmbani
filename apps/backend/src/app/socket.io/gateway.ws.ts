/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleware } from './middlewares/ws.middleware';
import { CORS_ALLOWED_URLS } from './utils/get-allowed-urls.util';

/**
 * App Web Socket gateway (infrastructure only)
 * Handles connection, disconnection, CORS, authentication.
 */
@WebSocketGateway({
  cors: {
    origin: [CORS_ALLOWED_URLS],
    credentials: true,
  },
  namespace: '/',
})
export class AppWebSocketGateway
  implements
    OnModuleInit,
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayConnection
{
  @WebSocketServer()
  server: Server;
  private readonly connectedClients: Map<string, Socket> = new Map();

  onModuleInit() {
    // Set max listeners to prevent warnings
    this.server.setMaxListeners(100);
    
    this.server.on('connection', (client: Socket) => {
      const clientId = client.id;
      this.connectedClients.set(clientId, client);
      
      // Set max listeners for individual sockets
      client.setMaxListeners(50);
      
      // Add disconnect listener to clean up
      client.on('disconnect', () => {
        this.connectedClients.delete(clientId);
        client.removeAllListeners();
        console.log(`Client disconnected: ${clientId}. Total clients: ${this.connectedClients.size}`);
      });
      
      console.log(`Client connected: ${clientId}. Total clients: ${this.connectedClients.size}`);
    });
  }

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }

  handleConnection() {
    this.server.emit('headers', {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    });
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.connectedClients.delete(clientId);
    
    // Clean up any remaining listeners on the socket
    client.removeAllListeners();
    
    console.log(`Client disconnected: ${clientId}. Total clients: ${this.connectedClients.size}`);
  }

  /**
   * Get all connected clients
   */
  getConnectedClients(): Map<string, Socket> {
    return this.connectedClients;
  }

  /**
   * Get a specific client by ID
   */
  getClient(clientId: string): Socket | undefined {
    return this.connectedClients.get(clientId);
  }

  /**
   * Broadcast to all connected clients
   */
  broadcastToAll(event: string, data: any): void {
    this.server.emit(event, data);
  }

  /**
   * Broadcast to all clients except the sender
   */
  broadcastToOthers(event: string, data: any, senderId: string): void {
    this.server.to(senderId).emit(event, data);
  }
}
