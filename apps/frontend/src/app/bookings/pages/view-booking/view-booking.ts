import { Component, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef, Dialog } from '@angular/cdk/dialog';
import { Booking } from '@newmbani/types';
import { DatePipe } from '@angular/common';
import { BookingsService } from '../../services/bookings.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';
import { ApproveBooking } from '../../../bookings/modals/approve-booking/approve-booking';

@Component({
  selector: 'app-view-booking',
  imports: [DatePipe],
  templateUrl: './view-booking.html',
  styleUrl: './view-booking.css',
})
export class ViewBooking {
  private data = inject(DIALOG_DATA) as { booking?: Booking } | null;
  private dialogRef = inject(DialogRef);
  private dialog = inject(Dialog);
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  booking = signal<Booking | null>(this.data?.booking ?? null);

  close(): void {
    try {
      this.dialogRef.close();
    } catch (e) {
      // fallback: no-op
    }
  }

  isCustomer(): boolean {
    return this.authService.getUserType().customer;
  }

  isLandlord(): boolean {
    return this.authService.getUserType().landlord;
  }

  cancelBooking(): void {
    const b = this.booking();
    if (!b) return;

    const reason = window.prompt(
      'Reason for cancelling this booking (optional):',
      '',
    );
    if (reason === null) return; // user cancelled prompt

    const customerId = this.authService.getStoredUser()?.customerId;
    if (!customerId) {
      this.notificationService.notify({
        title: 'Error',
        message: 'Unable to determine customer id',
        status: 'error' as any,
      });
      return;
    }

    this.bookingsService
      .createCancellation({
        customerId,
        bookingId: b._id,
        reason: reason || 'Cancelled by customer',
      })
      .subscribe({
        next: () => {
          this.notificationService.notify({
            title: 'Cancelled',
            message: 'Booking cancelled successfully',
            status: 'success' as any,
          });
          // close and signal parent to refresh
          try {
            this.dialogRef.close({ updated: true });
          } catch (e) {
            // ignore
          }
        },
        error: (err) => {
          this.notificationService.notify({
            title: 'Error',
            message: err?.error?.message || 'Failed to cancel booking',
            status: 'error' as any,
          });
        },
      });
  }

  openApproveModal(): void {
    const b = this.booking();
    if (!b) return;
    const ref = this.dialog.open(ApproveBooking, { data: { booking: b } });
    // if the approve modal signals updated, close this dialog and inform parent
    try {
      ref.closed.subscribe((res) => {
        if ((res as any)?.updated) {
          try {
            this.dialogRef.close({ updated: true });
          } catch (e) {
            // ignore
          }
        }
      });
    } catch (e) {
      // ignore subscription errors
    }
  }
}
