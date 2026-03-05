import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private platformId = inject(PLATFORM_ID);
  
  /**
   * Signal to track if the app is still initializing
   * This will be used to show a loading screen during app initialization
   * 
   * During SSR, we always start with false to avoid hydration mismatches
   * On the client, we start with true and set to false after initialization
   */
  readonly isInitializing = signal(!isPlatformBrowser(this.platformId));

  /**
   * Mark app as initialized
   */
  setInitialized(): void {
    this.isInitializing.set(false);
  }

  /**
   * Reset initialization state (useful for testing or re-initialization)
   */
  resetInitialization(): void {
    this.isInitializing.set(true);
  }
}
