import { Component, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Booking } from '@newmbani/types';
import { BookingsService } from '../../services/bookings.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../common/components/button/button';

@Component({
  selector: 'app-cancel-booking',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './cancel-booking.html',
  styleUrl: './cancel-booking.scss',
})
export class CancelBooking {
  private data = inject(DIALOG_DATA) as { booking?: Booking } | null;
  private dialogRef = inject(DialogRef);
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  booking = this.data?.booking ?? null;
  submitting = signal(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      reason: [''],
    });
  }

  close(): void {
    try {
      this.dialogRef.close();
    } catch (e) {
      // ignore
    }
  }

  submit(): void {
    if (!this.booking) return;
    if (this.form.invalid) return;

    const customerId = this.authService.getStoredUser()?.customerId;
    if (!customerId) {
      this.notificationService.notify({
        title: 'Error',
        message: 'Unable to determine customer id',
        status: 'error' as any,
      });
      return;
    }

    this.submitting.set(true);

    const payload = {
      customerId,
      bookingId: this.booking._id,
      reason: this.form.value.reason || 'Cancelled by customer',
    };

    this.bookingsService.createCancellation(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.notificationService.notify({
          title: 'Cancelled',
          message: 'Booking cancelled successfully',
          status: 'success' as any,
        });
        try {
          this.dialogRef.close({ updated: true });
        } catch (e) {
          // ignore
        }
      },
      error: (err) => {
        this.submitting.set(false);
        this.notificationService.notify({
          title: 'Error',
          message: (err as any)?.error?.message || 'Failed to cancel booking',
          status: 'error' as any,
        });
      },
    });
  }
}
