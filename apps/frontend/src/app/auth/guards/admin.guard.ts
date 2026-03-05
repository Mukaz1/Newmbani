import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const { admin } =  authService.getUserType();
    if (admin) {
      return true;
    } else {
      return false;
    }
  } else {
    // Redirect to the login page if the user is not authenticated
    return false;
  }
};

