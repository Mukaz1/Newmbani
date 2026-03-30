import { Component, inject, Input } from '@angular/core';

import { Router } from '@angular/router';
import { Invoice } from '@newmbani/types';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccess {
  @Input({ required: true }) invoice: Invoice | null = null;

  private readonly router = inject(Router);

  viewBooking(bookingId: string) {
    this.router.navigate([`/customer/bookings/${bookingId}`]);
  }
}
