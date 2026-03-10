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
  PropertyListing,
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
import { PricePipe } from '../../../common/pipes/price.pipe';
import {
  CommonModule,
  DatePipe,
  NgClass,
  SlicePipe,
  TitleCasePipe,
} from '@angular/common';

@Component({
  selector: 'app-landlord-dashboard',
  imports: [
    Button,
    RouterLink,
    BookingChart,
    DoughnutChart,
    PricePipe,
    CommonModule,
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
  listings = signal<PropertyListing[]>([]);
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
    }, 60000); // update every 60 seconds
    this.fetchProperties();
    this.getPropertyListings();
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
        next: (res: HttpResponseInterface<PaginatedData<Property[]>>) => {
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
        dashboard,
        limit: this.pageSize(),
        keyword: this.keyword(),
        page: this.currentPage(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.bookings.set(res.data.data);
          this.isLoading.set(false);
          this.calculateMonthlyTotals();
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

  getBookingStatus(booking: Booking): 'Booked' | 'Active' | 'Closed' {
    if (!booking?.invoice?.items?.length) return 'Closed';

    const checkIn = booking.invoice?.items?.[0]?.metadata?.checkIn;
    const checkOut = booking.invoice?.items?.[0]?.metadata?.checkOut;

    if (!checkIn || !checkOut) return 'Closed';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inDate = new Date(checkIn);
    inDate.setHours(0, 0, 0, 0);

    const outDate = new Date(checkOut);
    outDate.setHours(0, 0, 0, 0);

    if (today < inDate) {
      return 'Booked';
    } else if (today >= inDate && today < outDate) {
      return 'Active';
    } else {
      return 'Closed';
    }
  }

  get activeOrScheduledBookings() {
    const bookings = this.bookings?.();
    if (!Array.isArray(bookings)) return [];
    return bookings.filter((b: Booking) => {
      const status = this.getBookingStatus(b);
      return status === 'Booked' || status === 'Active';
    });
  }
  viewBookings() {
    this.router.navigate(['/landlord/bookings']);
  }

  viewBooking(bookingId?: string) {
    // If bookingId is provided, use it; otherwise, try to get the first booking's _id
    let id = bookingId;
    if (!id) {
      const bookings = this.bookings;
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

  private calculateMonthlyTotals() {
    const bookings = this.bookings() ?? [];
    if (!bookings.length) return;

    const grouped: Record<string, { revenue: number; count: number }> = {};

    for (const b of bookings) {
      const date = new Date(b.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!grouped[key]) grouped[key] = { revenue: 0, count: 0 };
      grouped[key].revenue += b.total ?? 0;
      grouped[key].count += 1;
    }

    const result = Object.entries(grouped).map(([key, stats]) => {
      const [year, month] = key.split('-');
      const monthName = new Date(+year, +month - 1).toLocaleString('en-US', {
        month: 'short',
      });

      return {
        month: `${monthName} ${year}`,
        revenue: stats.revenue,
        count: stats.count,
      };
    });

    this.monthlyBookingTotals.set(result);
    this.totalRevenue.set(result.reduce((sum, m) => sum + m.revenue, 0));
    this.totalBookings.set(result.reduce((sum, m) => sum + m.count, 0));
  }

  private calculateListingPieData() {
    const listings = this.listings() ?? [];
    if (!listings.length) return;

    const result = listings.map((l) => ({
      title: l.property?.name ?? 'Unknown',
      count: l.bookings?.length ?? 0,
    }));

    this.listingBookingStats.set(result);

    // Push to chart
    setTimeout(() => {
      this.listingChart?.setChartData(result);
    });
  }
}
