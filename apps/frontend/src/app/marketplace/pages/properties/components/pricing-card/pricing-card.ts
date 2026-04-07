import { Component, computed, inject, input } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { NotificationStatusEnum, Property } from '@newmbani/types';
import { AuthService } from '../../../../../auth/services/auth.service';
import { BookProperty } from '../book-property/book-property';
import { NotificationService } from '../../../../../common/services/notification.service';

@Component({
  selector: 'app-pricing-card',
  imports: [],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.scss',
})
export class PricingCard {
  currentProperty = input<Property | null>(null);

  isLoggedIn = computed(() => this.authService.isAuthenticated());
  userType = computed(() => this.authService.getUserType());

  private dialog = inject(Dialog);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  makeAppointment(): void {
    const property = this.currentProperty();
    if (!property) return;

    // 1. Not logged in → redirect to login with redirectTo param
    if (!this.isLoggedIn()) {
      // capture current URL to return after login
      const currentUrl = this.router.url;
      this.router.navigate(['/auth/login/email'], {
        queryParams: { redirectTo: currentUrl },
      });
      return;
    }

    // 2. Logged in but not a customer → notify
    if (!this.userType().customer) {
      this.notificationService.notify({
        title: 'Access Denied',
        message: 'Only customers can make appointments.',
        status: 'warning' as any,
      });
      return;
    }

    // 3. Valid customer → proceed
    this.dialog.open(BookProperty, {
      data: { property },
    });
  }
}
