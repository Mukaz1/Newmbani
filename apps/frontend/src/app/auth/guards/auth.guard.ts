import { inject, Injectable } from '@angular/core';
import { CanActivate,CanMatch, CanActivateChild, Router, UrlTree, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch, CanActivate, CanActivateChild {
  private authService = inject(AuthService);
  private router = inject(Router);
 

  canMatch(route: Route): boolean | UrlTree {
    return this.checkAuth() ? true :  this.router.parseUrl(`/login`)
  }

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }

  canLoad(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    return this.authService.isAuthenticated()
  }
}
