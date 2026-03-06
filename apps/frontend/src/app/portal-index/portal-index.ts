import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataLoading } from '../common/components/data-loading/data-loading';
import { AuthService } from '../auth/services/auth.service';
import { User } from '@newmbani/types';

@Component({
  selector: 'app-portal-index',
  imports: [DataLoading],
  templateUrl: './portal-index.html',
  styleUrl: './portal-index.scss',
})
export class PortalIndex {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  isLoading = true;

  constructor() {
    this.navigate(this.authService.user());
  }

  navigate(user: User | null) {
    if (!user) {
      this.router.navigateByUrl('/auth');
    } else {
      const { employeeId, hostId, customerId } = user;
      if (employeeId) {
        this.router.navigateByUrl('/admin/dashboard');
      } else if (hostId) {
        this.router.navigateByUrl('/host/dashboard');
      } else if (customerId) {
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl('/');
      }
    }
  }
}
