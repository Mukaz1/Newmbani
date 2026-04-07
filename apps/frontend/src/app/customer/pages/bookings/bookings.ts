import { Dialog } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Booking, BookingStatusEnum } from '@newmbani/types';
import { take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ApproveBooking } from '../../../bookings/modals/approve-booking/approve-booking';
import { CancelBooking } from '../../../bookings/modals/cancel-booking/cancel-booking';
import { ViewBooking } from '../../../bookings/pages/view-booking/view-booking';
import { BookingsService } from '../../../bookings/services/bookings.service';
import { ConfirmDialog } from '../../../common/components/confirm-dialog/confirm-dialog';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { Pagination } from '../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../common/components/search-input-widget/search-input-widget';
import { NotificationService } from '../../../common/services/notification.service';
import { BookProperty } from '../../../marketplace/pages/properties/components/book-property/book-property';

@Component({
  selector: 'app-bookings',
  imports: [    DataLoading,
    Pagination,
    SearchInputWidget,
    DatePipe,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger, NgClass, TitleCasePipe],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings {
  isLoading = signal(true);
  bookings = signal<Booking[]>([]);
  paginatedData = signal<any | undefined>(undefined);
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  selectedBookings = signal<string[]>([]);
  @ViewChild('selectAllElement') selectAllElement!: ElementRef;

  private readonly bookingsService = inject(BookingsService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);


  BookingStatus = BookingStatusEnum;

  ngOnInit() {
    this.fetchBookings();
  }

  onSelectAll(e: Event) {
    const isChecked = (e.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedBookings.set(this.bookings().map((b) => b._id));
    } else {
      this.selectedBookings.set([]);
    }
  }

  selectBooking(e: Event, id: string) {
    const isChecked = (e.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedBookings.set([...this.selectedBookings(), id]);
    } else {
      this.selectedBookings.set(
        this.selectedBookings().filter((i) => i !== id),
      );
    }
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize.set(pageSize);
    this.currentPage.set(1);
    this.fetchBookings();
  }

  fetchBookings() {
    this.isLoading.set(true);
    this.bookingsService
      .getBookings({
        limit: this.pageSize(),
        page: this.currentPage(),
        keyword: this.keyword(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.bookings.set(res.data.data as Booking[]);
          this.paginatedData.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message: (err as any).error?.message || 'Failed to fetch bookings',
            status: 'error' as any,
          });
        },
      });
  }

  getBookingStatus(booking: Booking): BookingStatusEnum {
    // Simply return the booking's assigned status
    return booking?.status;
  }


  onSearchTermChange(value: string) {
    this.keyword.set(value);
    this.currentPage.set(1);
    this.fetchBookings();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.fetchBookings();
  }

  isAdmin(): boolean {
    return this.authService.getUserType().admin;
  }
  isLandlord(): boolean {
    return this.authService.getUserType().landlord;
  }
  isCustomer(): boolean {
    return this.authService.getUserType().customer;
  }
  updateBooking(bookingId: string) {
    const booking = this.bookings().find((b) => b._id === bookingId);
    if (!booking) return;

    const ref = this.dialog.open(BookProperty, {
      data: {
        property: booking.property,
        bookingId: booking._id,
        initialDate: booking.viewingDate,
      },
    });

    ref.closed.pipe(take(1)).subscribe((res) => {
      if (res) this.fetchBookings();
    });
  }
  approveBooking(booking: Booking) {
    const ref = this.dialog.open(ApproveBooking, { data: { booking } });
    ref.closed.pipe(take(1)).subscribe((res) => {
      if (res) this.fetchBookings();
    });
  }
  viewBooking(id: string) {
    const booking = this.bookings().find((b) => b._id === id);
    if (!booking) return;

    const ref = this.dialog.open(ViewBooking, { data: { booking } });
    ref.closed.pipe(take(1)).subscribe((res) => {
      if ((res as any)?.updated) this.fetchBookings();
    });
  }

  cancelBooking(id: string): void {
    const b = this.bookings().find((b) => b._id === id);
    if (!b) return;
    const ref = this.dialog.open(CancelBooking, { data: { booking: b } });

    try {
      ref.closed.subscribe((res: any) => {
        if (res?.updated) {
          this.fetchBookings();
        }
      });
    } catch (e) {
      // ignore
    }
  }

  deleteBooking(bookingId: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Booking',
        message: 'Are you sure you want to delete this booking?',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      },
    });

    dialogRef.closed.pipe(take(1)).subscribe((confirmed) => {
      if (confirmed) {
        this.bookingsService
          .deleteBooking(bookingId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.bookings.update((list) =>
                list.filter((b) => b._id !== bookingId),
              );
              this.notificationService.notify({
                title: 'Deleted',
                message: 'Booking deleted',
                status: 'success' as any,
              });
            },
            error: (err) => {
              this.notificationService.notify({
                title: 'Error',
                message: (err as any).message || 'Delete failed',
                status: 'error' as any,
              });
            },
          });
      }
    });
  }
}
