import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { signal, computed } from '@angular/core';
import {
  Booking,
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
import { PricePipe } from '../../../common/pipes/price.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, SlicePipe, TitleCasePipe, PricePipe, NgClass, DatePipe],
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

  private readonly bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private router = inject(Router);
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
        next: (res: HttpResponseInterface<PaginatedData<Booking[]>>) => {
          this.bookings.set(res.data.data);
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

  getBookingStatus(booking: Booking): 'Scheduled' | 'Active' | 'Completed' {
    if (!booking?.invoice?.items?.length) return 'Completed';

    const checkIn = booking.invoice?.items?.[0]?.metadata?.checkIn;
    const checkOut = booking.invoice?.items?.[0]?.metadata?.checkOut;

    if (!checkIn || !checkOut) return 'Completed';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inDate = new Date(checkIn);
    inDate.setHours(0, 0, 0, 0);

    const outDate = new Date(checkOut);
    outDate.setHours(0, 0, 0, 0);

    if (today < inDate) {
      return 'Scheduled';
    } else if (today >= inDate && today < outDate) {
      return 'Active';
    } else {
      return 'Completed';
    }
  }

  get completedBookings() {
    const bookings = this.bookings?.();
    if (!Array.isArray(bookings)) return [];
    return bookings.filter((b: Booking) => {
      const status = this.getBookingStatus(b);
      return status === 'Completed';
    });
  }
  get activeOrScheduledBookings() {
    const bookings = this.bookings?.();
    if (!Array.isArray(bookings)) return [];
    return bookings.filter((b: Booking) => {
      const status = this.getBookingStatus(b);
      return status === 'Scheduled' || status === 'Active';
    });
  }

  viewBooking(id: string) {
    this.router.navigate([`/customer/bookings/${id}`]);
  }
}
