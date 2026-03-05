import { Injectable, inject } from '@angular/core';
import {  CanActivateChild, CanMatch, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerGuard implements CanMatch{
  private authService = inject(AuthService);
  private router = inject(Router);

  async canMatch(route:Route): Promise<boolean> {
    return await this.checkAuth(route.path);
  }

  private async checkAuth(next?:string): Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      const { customer } = this.authService.getUserType();
      if (customer) {
        return true;
      } else {
        return false;
      }
    } else {
      // Redirect to the login page if the user is not authenticated
      await this.router.navigate([`/auth/login?next=${next}`]);
      return false;
    }
  }
}
