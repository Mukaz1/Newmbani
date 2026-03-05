import { EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { AppInitializerService } from '../services/app-initializer.service';

/**
 * Factory function for app initialization
 * Ensures countries, supported countries, and currencies are loaded
 * before the app becomes available to users.
 */
export function appInitializerFactory(injector: EnvironmentInjector) {
  return () =>
    runInInjectionContext(injector, () => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.initialize();
    });
}
