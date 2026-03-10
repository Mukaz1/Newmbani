import {
  APP_ID,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CdkMenuModule } from '@angular/cdk/menu';
import { HttpResponseInterceptor } from './common/interceptors/http-response.interceptor';
import { LoadTimeInterceptor } from './common/interceptors/load-time.interceptor';
import { TokenInterceptor } from './common/interceptors/token.interceptor';
import { routes } from './app.routes';
import { AppInitializerService } from './common/services/app-initializer.service';
// import { GoogleMapsModule } from '@angular/google-maps';


export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(() => {
      const appInit = inject(AppInitializerService);
      return appInit.initialize();
    }),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    importProvidersFrom(CdkMenuModule),
    // importProvidersFrom(GoogleMapsModule),

    DatePipe,
    { provide: APP_ID, useValue: 'serverApp' },

    // ✅ Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadTimeInterceptor,
      multi: true,
    },

  ],
};
