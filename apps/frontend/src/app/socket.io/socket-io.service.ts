import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AUTH_TOKEN_KEY } from '../auth/auth.constants';
import { AuthService } from '../auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly apiURL: string = environment.apiURL;
  private sockets: { [key: string]: Socket } = {};
  private eventQueues: { [key: string]: { event: string; data: any }[] } = {};
  private readonly authService = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Create a no-op socket stub for non-browser environments (e.g., SSR)
   */
  private createStubSocket(namespace: string): Socket {
    // Minimal stub implementing necessary methods
    const stub: any = {
      connected: false,
      connect: () => stub,
      disconnect: () => {
        /* SSR no-op */
        return;
      },
      emit: (_event: string, _data?: any) => {
        /* SSR no-op */
        return true;
      },
      on: (_event: string, _cb: (...args: any[]) => void) => stub,
      off: (_event?: string, _cb?: (...args: any[]) => void) => stub,
      removeAllListeners: () => {
        /* SSR no-op */
        return;
      },
    };
    // Cache stub so repeated calls return same instance
    this.sockets[namespace] = stub as Socket;
    return this.sockets[namespace];
  }

  /**
   * Get or create a socket for a namespace
   */
  getSocket(namespace = '/'): Socket {
    // In SSR/non-browser environments, return a stub and avoid creating real sockets
    if (!this.isBrowser) {
      return this.sockets[namespace] ?? this.createStubSocket(namespace);
    }

    if (!this.sockets[namespace]) {
      const token = this.getToken();

      const socket: Socket = io(`${this.apiURL}${namespace}`, {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        secure: environment.production,
        auth: {
          authorization: `Bearer ${token}`,
        },
        forceNew: false,
      });

      this.sockets[namespace] = socket;
      this.eventQueues[namespace] = [];

      // Handle connection: flush queued events
      socket.on('connect', () => {
        const queue = this.eventQueues[namespace] ?? [];
        while (queue.length > 0) {
          const queued = queue.shift();
          if (queued) {
            socket.emit(queued.event, queued.data);
          }
        }
      });

      // Handle disconnection (optional logging)
      socket.on('disconnect', (reason) => {
        console.warn(`Disconnected from ${namespace}:`, reason);
      });
    }

    return this.sockets[namespace];
  }

  /**
   * Emit an event safely (queues if socket not ready)
   */
  emit(namespace: string, event: string, data?: any) {
    const socket = this.getSocket(namespace);

    if (socket.connected) {
      socket.emit(event, data);
    } else {
      // Initialize queue if missing
      if (!this.eventQueues[namespace]) {
        this.eventQueues[namespace] = [];
      }
      this.eventQueues[namespace].push({ event, data });
    }
  }

  /**
   * Disconnect sockets
   */
  disconnect(namespace?: string) {
    if (namespace && this.sockets[namespace]) {
      this.sockets[namespace].disconnect();
      delete this.sockets[namespace];
      delete this.eventQueues[namespace];
    } else {
      Object.keys(this.sockets).forEach((ns) => {
        this.sockets[ns].disconnect();
        delete this.sockets[ns];
        delete this.eventQueues[ns];
      });
    }
  }

  /**
   * Get JWT token
   */
  private getToken(): string | null {
    if (!this.isBrowser) return '';
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}
