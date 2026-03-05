/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  platformId = inject(PLATFORM_ID)
  isBrowser = isPlatformBrowser(this.platformId)

  /**
   * Intercept the request
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @return {*}  {Observable<HttpEvent<any>>}
   * @memberof HttpResponseInterceptor
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: async (event) => {
          if (event instanceof HttpResponse) {
            const url = getCurrentURL(this.isBrowser);

            if (event.status == 401 && !url.includes('auth')) {
              saveCurrentRoute(this.isBrowser);
              await this.authService.logout(true);
            }
          }
          return event;
        },
        error: async (error) => {
          const url = getCurrentURL(this.isBrowser);
          if (error.status === 401 && !url.includes('auth')) {
            saveCurrentRoute(this.isBrowser);
            await this.authService.logout(true);
          }
        },
      })
    );
  }
}

function getCurrentURL(isBrowser:boolean) {
  const url = isBrowser ?   location.pathname + location.search:"";
  return url;
}

function saveCurrentRoute(isBrowser:boolean) {
  
  const url = getCurrentURL(isBrowser);
  if (!url.includes('auth') && isBrowser) {
    return localStorage.setItem('current_url', location.pathname);
  }
}
