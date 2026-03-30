import { Component, Input } from '@angular/core';
import { Booking } from '@newmbani/types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [ DatePipe],
  templateUrl: './booking-summary.html',
  styleUrl: './booking-summary.scss',
})
export class BookingSummary {
  @Input({ required: true }) booking: Booking | null = null;

  downloadInvoice(): void {
    console.log('Downloading invoice...');
    // Implement download logic here
  }
}
