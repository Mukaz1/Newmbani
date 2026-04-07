import { Component, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef, Dialog } from '@angular/cdk/dialog';
import { Booking, BookingStatusEnum } from '@newmbani/types';
import { DatePipe } from '@angular/common';
import { BookingsService } from '../../services/bookings.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';
import { ApproveBooking } from '../../../bookings/modals/approve-booking/approve-booking';
import { CancelBooking } from '../../modals/cancel-booking/cancel-booking';
import { Button } from '../../../common/components/button/button';

@Component({
  selector: 'app-view-booking',
  imports: [DatePipe, Button],
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
BookingStatus = BookingStatusEnum
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
    const ref = this.dialog.open(CancelBooking, { data: { booking: b } });

    try {
      ref.closed.subscribe((res: any) => {
        if (res?.updated) {
          try {
            this.dialogRef.close({ updated: true });
          } catch (e) {
            // ignore
          }
        }
      });
    } catch (e) {
      // ignore
    }
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
