import { Injectable, inject } from '@angular/core';
import { CanMatch } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HostGuard implements CanMatch {
  private authService = inject(AuthService);


   canMatch(): boolean {
    return  this.checkAuth();
  }

  

  private  checkAuth(): boolean {
    if (this.authService.isAuthenticated()) {
      const { host } =  this.authService.getUserType();
      if (host) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
