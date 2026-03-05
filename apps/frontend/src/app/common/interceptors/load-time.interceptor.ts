import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoadTimeInterceptor implements HttpInterceptor {

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const startTime = new Date().getTime();
    return next.handle(request).pipe(
      map((event: any) => {
        const endTime = new Date().getTime();
        const diff = endTime - startTime;
        if (environment.production === false) {
          const loadTime = `${request.url} success in ${diff} ms`;
        }
        return event;
      })
    );
  }
}
