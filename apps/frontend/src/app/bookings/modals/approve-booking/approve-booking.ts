import { Component, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Booking, BookingStatusEnum } from '@newmbani/types';
import { BookingsService } from '../../services/bookings.service';
import { NotificationService } from '../../../common/services/notification.service';

@Component({
  selector: 'app-approve-booking',
  imports: [DatePipe],
  templateUrl: './approve-booking.html',
  styleUrl: './approve-booking.scss',
})
export class ApproveBooking {
  private data = inject(DIALOG_DATA) as { booking: Booking } | null;
  private dialogRef = inject(DialogRef);
  private bookingsService = inject(BookingsService);
  private notificationService = inject(NotificationService);

  approving = signal(false);

  booking = this.data?.booking ?? null;

  close(): void {
    try {
      this.dialogRef.close();
    } catch (e) {
      // ignore
    }
  }

  approve(): void {
    if (!this.booking) return;
    this.approving.set(true);
    this.bookingsService
      .updateBookingStatus(this.booking._id, BookingStatusEnum.APPROVED)
      .subscribe({
        next: () => {
          this.approving.set(false);
          this.notificationService.notify({
            title: 'Approved',
            message: 'Booking approved',
            status: 'success' as any,
          });
          try {
            this.dialogRef.close({ updated: true });
          } catch (e) {
            // ignore
          }
        },
        error: (err) => {
          this.approving.set(false);
          this.notificationService.notify({
            title: 'Error',
            message:
              (err as any)?.error?.message || 'Failed to approve booking',
            status: 'error' as any,
          });
        },
      });
  }
}
