import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import {
  HttpResponseInterface,
  PaginatedData,
  NotificationStatusEnum,
  Property,
  DashboardsEnum,
  Booking,
} from '@newmbani/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../common/services/notification.service';
import { PropertiesService } from '../../../properties/services/properties.service';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs';
import { BookingsService } from '../../../bookings/services/bookings.service';
import { Button } from '../../../common/components/button/button';
import { MetaService } from '../../../common/services/meta.service';
import { BookingChart } from '../../Components/booking-chart/booking-chart';
import { DoughnutChart } from '../../Components/doughnut-chart/doughnut-chart';
import {
  DatePipe,
  DecimalPipe,
  NgClass,
  SlicePipe,
  TitleCasePipe,
} from '@angular/common';
import { BookingStatusEnum } from '@newmbani/types'; // Proper enum import

@Component({
  selector: 'app-landlord-dashboard',
  imports: [
    Button,
    RouterLink,
    BookingChart,
    DoughnutChart,
    NgClass, TitleCasePipe, DatePipe, SlicePipe, DecimalPipe
  ],
  templateUrl: './landlord-dashboard.html',
  styleUrl: './landlord-dashboard.scss',
})
export class LandlordDashboard implements OnInit {
  currentDate = new Date().toLocaleDateString();
  user = inject(AuthService).user;
  greeting = signal(this.getGreeting());
  error = signal<string | null>(null);
  properties = signal<Property[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  isLoading = signal(false);
  selectedProperties = signal<string[]>([]);
  allSelected = signal(false);
  form: FormGroup = new FormGroup({});
  expressMode = signal<boolean | undefined>(undefined);
  categoryId = signal<string | undefined>(undefined);
  bookings = signal<Booking[]>([]);
  totalRevenue = signal(0);
  totalBookings = signal(0);
  monthlyBookingTotals = signal<
    { month: string; revenue: number; count: number }[]
  >([]);
  listingBookingStats = signal<{ title: string; count: number }[]>([]);

  private readonly bookingsService = inject(BookingsService);
  private readonly propertiesService = inject(PropertiesService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly metaService = inject(MetaService);
  @ViewChild('listingChart') listingChart!: any;
  BookingStatusEnum =BookingStatusEnum
  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Landlord Dashboard',
            isClickable: false,
          },
        ],
      },
      title: 'Landlord Dashboard',
      description:
        'Overview of your listings, bookings, and landlord activity.',
    });
  }

  ngOnInit() {
    setInterval(() => {
      this.greeting.set(this.getGreeting());
    }, 60000);
    this.fetchProperties();
    this.fetchBookings();
  }

  fetchProperties() {
    this.isLoading.set(true);
    this.propertiesService
      .getAllProperties({
        limit: this.pageSize(),
        page: this.currentPage(),
        categoryId: this.categoryId(),
        keyword: this.keyword(),
        landlordId: this.authService.user()?.landlordId,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const res = response as HttpResponseInterface<PaginatedData<Property[]>>;
          this.properties.set(res.data.data);
          this.paginatedData.set(res.data);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message: error.error.message || 'Failed to fetch properties',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
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
        next: (response) => {
          const res = response as HttpResponseInterface<PaginatedData<Booking[]>>;
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

  getBookingStatus(booking: Booking): BookingStatusEnum {
    // Simply return the booking's assigned status
    return booking?.status;
  }

  get activeOrScheduledBookings() {
    const bookings = this.bookings?.();
    if (!Array.isArray(bookings)) return [];
    return bookings.filter((b: Booking) => {
      const status = this.getBookingStatus(b);
      return status === BookingStatusEnum.PENDING || status === BookingStatusEnum.APPROVED;
    });
  }

  viewBookings() {
    this.router.navigate(['/landlord/bookings']);
  }

  viewBooking(bookingId?: string) {
    let id = bookingId;
    if (!id) {
      const bookings = this.bookings();
      if (Array.isArray(bookings) && bookings.length > 0 && bookings[0]?._id) {
        id = bookings[0]._id;
      }
    }
    if (id) {
      this.router.navigateByUrl(`/landlord/bookings/${id}`);
    } else {
      this.notificationService?.notify?.({
        title: 'Error',
        message: 'No booking found to view.',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }
}
