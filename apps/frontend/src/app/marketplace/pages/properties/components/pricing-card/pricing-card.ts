import {
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Property } from '@newmbani/types';
import { AuthService } from '../../../../../auth/services/auth.service';
import { BookProperty } from '../book-property/book-property';

@Component({
  selector: 'app-pricing-card',
  imports: [],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.scss',
})
export class PricingCard {
  /** The property whose pricing & landlord info is shown */
  currentProperty = input<Property | null>(null);

  isLoggedIn = computed(() => this.authService.isAuthenticated());
  userType = computed(() => this.authService.getUserType());

  private dialog = inject(Dialog);
  private authService = inject(AuthService);

  /** Opens the appointment/booking modal */
  makeAppointment(): void {
    const property = this.currentProperty();
    if (!property) return;

    this.dialog.open(BookProperty, {
      data: { property },
    });
  }


}