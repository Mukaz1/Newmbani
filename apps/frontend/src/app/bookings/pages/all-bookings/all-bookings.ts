/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BookingsService } from '../../services/bookings.service';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { Pagination } from '../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../common/components/search-input-widget/search-input-widget';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../common/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmDialog } from '../../../common/components/confirm-dialog/confirm-dialog';
import { Booking } from '@newmbani/types';
import { take } from 'rxjs';

@Component({
  selector: 'app-all-bookings',
  imports: [DataLoading, Pagination, SearchInputWidget, DatePipe],
  templateUrl: './all-bookings.html',
  styleUrl: './all-bookings.css',
})
export class AllBookings implements OnInit {
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
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

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

  onSearchTermChange(value: string) {
    this.keyword.set(value);
    this.currentPage.set(1);
    this.fetchBookings();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.fetchBookings();
  }

  viewBooking(id: string) {
    // navigation handled elsewhere; placeholder
    console.log('view', id);
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
