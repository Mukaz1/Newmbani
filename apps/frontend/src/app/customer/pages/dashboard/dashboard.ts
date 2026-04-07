import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { signal, computed } from '@angular/core';
import {
  Booking,
  BookingStatusEnum,
  DashboardsEnum,
  HttpResponseInterface,
  NotificationStatusEnum,
  PaginatedData,
  User,
} from '@newmbani/types';
import { AuthService } from '../../../auth/services/auth.service';
import { BookingsService } from '../../../bookings/services/bookings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../common/services/notification.service';
import { DatePipe, NgClass, SlicePipe, TitleCasePipe } from '@angular/common';
import { MetaService } from '../../../common/services/meta.service';
import { ViewBooking } from '../../../bookings/pages/view-booking/view-booking';
import { take } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, SlicePipe, TitleCasePipe,  NgClass, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class CustomerDashboard implements OnInit {
  bookings = signal<Booking[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  isLoading = signal(false);
  isLoadingAddresses = signal(false);
  user = signal<User | null>(null);
  userName = computed(() => {
    const user = this.user();
    return user ? `${user.name}` : 'Guest';
  });

  BookingStatus = BookingStatusEnum
  private readonly bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(Dialog)
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);
  private readonly metaService = inject(MetaService);

  constructor() {
    this.loadUserData();
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Dashboard',
            isClickable: false,
          },
        ],
      },
      title: 'Dashboard',
      description:
        'Overview of your bookings, addresses, and account activity.',
    });
  }

  ngOnInit() {
    this.fetchBookings();
    this.loadUserData();
  }

  private loadUserData() {
    this.user.set(this.authService.user());
  }

  goBack() {
    this.router.navigate(['/customer/addresses']);
  }
  fetchBookings() {
    const endpoint = this.router.url;
    const dashboard = endpoint.includes('customer')
      ? DashboardsEnum.CUSTOMER
      : endpoint.includes('landlord')
        ? DashboardsEnum.LANDLORD
        : DashboardsEnum.ADMIN;
    this.isLoading.set(true);
    this.bookingsService
      .getBookings({
        limit: this.pageSize(),
        keyword: this.keyword(),
        page: this.currentPage(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const response = res as HttpResponseInterface<PaginatedData<Booking[]>>
          this.bookings.set(response.data.data);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message: error.error.message || 'Failed to fetch bookings',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  getBookingStatus(booking: Booking): BookingStatusEnum {
    // Simply return the booking's assigned status
    return booking?.status;
  }

  get completedBookings() {
    const bookings = this.bookings?.();
    if (!Array.isArray(bookings)) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    return bookings.filter((b: Booking) => {
      if (!b.viewingDate) return false;
      const viewingDate = new Date(b.viewingDate);
      viewingDate.setHours(0, 0, 0, 0); // Compare only date, not time
      return viewingDate < today;
    });
  }
  get activeOrScheduledBookings() {
    const bookings = this.bookings?.();
    if (!Array.isArray(bookings)) return [];
    return bookings.filter((b: Booking) => {
      const status = this.getBookingStatus(b);
      return status === BookingStatusEnum.APPROVED || status === BookingStatusEnum.PENDING;
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
}
