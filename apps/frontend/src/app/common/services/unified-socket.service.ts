/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class UnifiedSocketService {
  private socket: Socket | undefined;
  private readonly apiURL: string = environment.apiURL;
  private platformId: object = inject(PLATFORM_ID);
  private isBrowser: boolean = isPlatformBrowser(this.platformId);
  private isConnected = false;
  private isInitialized = false;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    if (!this.isBrowser || this.isInitialized) {
      return;
    }

    const token: string | undefined = this.getToken();

    if (token) {
      this.socket = io(this.apiURL, {
        secure: environment.production,
        auth: {
          authorization: `Bearer ${token}`,
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket', 'polling'],
        forceNew: false, // Prevent multiple connections
      });

      this.setupEventListeners();
    } else {
      // Create public socket without authentication
      this.socket = io(this.apiURL, {
        secure: environment.production,
        transports: ['websocket', 'polling'],
        forceNew: false, // Prevent multiple connections
      });
      this.setupEventListeners();
    }

    this.isInitialized = true;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('disconnect', (reason: string) => {
      console.warn('Socket disconnected:', reason);
      this.isConnected = false;
    });
  }

  private getToken(): string | undefined {
    if (this.isBrowser) {
      return localStorage.getItem('auth-token') || undefined;
    }
    return undefined;
  }

  // Public methods
  connect(): void {
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, attempting to reconnect...');
      this.connect();
      // Retry after a short delay
      setTimeout(() => {
        if (this.socket && this.socket.connected) {
          this.socket.emit(event, data);
        } else {
          console.error('Failed to emit message: socket not connected');
        }
      }, 1000);
    }
  }

  on(event: string, callback: (...args: Array<any>) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: Array<any>) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  removeAllListeners(events: string[]): void {
    if (!this.socket) return;
    events.forEach((event: string) => {
      this.socket?.removeAllListeners(event);
    });
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Method to reinitialize socket (useful when token changes)
  reinitialize(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
    }
    this.isInitialized = false;
    this.initializeSocket();
  }
}
