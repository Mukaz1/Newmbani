/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UnifiedSocketService } from './unified-socket.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIOService {
  private platformId: object = inject(PLATFORM_ID);
  private isBrowser: boolean = isPlatformBrowser(this.platformId);
  private unifiedSocketService = inject(UnifiedSocketService);

  connect(): void {
    if (this.isBrowser) {
      this.unifiedSocketService.connect();
    }
  }

  disconnect(): void {
    if (this.isBrowser) {
      this.unifiedSocketService.disconnect();
    }
  }

  on(event: string, callback: (...args: Array<any>) => void): void {
    if (this.isBrowser) {
      this.unifiedSocketService.on(event, callback);
    }
  }

  emit(event: string, data: any): void {
    if (this.isBrowser) {
      this.unifiedSocketService.emit(event, data);
    }
  }

  off(event: string, callback?: (...args: Array<any>) => void): void {
    if (this.isBrowser) {
      this.unifiedSocketService.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.isBrowser && this.unifiedSocketService.isSocketConnected();
  }
}
