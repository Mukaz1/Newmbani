import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { Booking, PropertyListing } from '@newmbani/types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-message',
  imports: [DatePipe],
  templateUrl: './booking-message.html',
  styleUrl: './booking-message.scss',
})
export class BookingMessage {
  booking = signal<Booking | null>(null);
  listing = signal<PropertyListing | null>(null);

  private dialogRef = inject(DialogRef<unknown>);
  private router = inject(Router);
  private data = inject(DIALOG_DATA) as {
    booking: Booking;
  };
  constructor() {
    this.booking.set(this.data.booking);
  }

  viewBooking() {
    const bookingId = this.booking()?._id;
    if (bookingId) {
      this.router.navigate(['/customer/bookings', bookingId]);
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
