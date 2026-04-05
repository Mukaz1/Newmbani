import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { Property, NotificationStatusEnum } from '@newmbani/types';
import { AuthService } from '../../../../../auth/services/auth.service';
import { PropertiesService } from '../../../../../properties/services/properties.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { BookingMessage } from '../booking-message/booking-message';
import { DatePipe, NgClass } from '@angular/common';
import { Button } from '../../../../../common/components/button/button';
import { BookingsService } from 'apps/frontend/src/app/bookings/services/bookings.service';

@Component({
  selector: 'app-book-property',
  imports: [DatePipe, NgClass, Button],
  templateUrl: './book-property.html',
  styleUrl: './book-property.css',
})
export class BookProperty implements OnInit {
  // ─── State ───────────────────────────────────────────────────────────
  property = signal<Property | null>(null);
  selectedDate = signal<Date | null>(null);
  isLoading = signal(false);
  unavailableDates = signal<Date[]>([]);

  // ─── Calendar ────────────────────────────────────────────────────────
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());

  readonly weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  /** Flat array of Date | null (null = padding cell before first day) */
  calendarDays = computed<(Date | null)[]>(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = Array(firstDayOfWeek).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  });

  currentMonthLabel = computed(
    () => `${this.monthNames[this.currentMonth()]} ${this.currentYear()}`
  );

  isLoggedIn = computed(() => this.authService.isAuthenticated());

  // ─── DI ──────────────────────────────────────────────────────────────
  private dialogRef = inject(DialogRef<unknown>);
  private dialog = inject(Dialog);
  private router = inject(Router);
  private authService = inject(AuthService);
  private propertiesService = inject(PropertiesService);
  private bookingsService = inject(BookingsService);
  private notificationService = inject(NotificationService);
  private data = inject(DIALOG_DATA) as { property: Property };

  constructor() {
    this.property.set(this.data.property);
  }

  ngOnInit(): void {
    this.loadUnavailableDates();
  }

  // ─── Calendar helpers ─────────────────────────────────────────────────
  prevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  selectDate(date: Date | null): void {
    if (!date || this.isPast(date) || this.isUnavailable(date)) return;
    this.selectedDate.set(date);
  }

  isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  isUnavailable(date: Date): boolean {
    return this.unavailableDates().some(
      (d) => d.toDateString() === date.toDateString()
    );
  }

  isSelected(date: Date): boolean {
    const s = this.selectedDate();
    return !!s && s.toDateString() === date.toDateString();
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  // ─── Booking ─────────────────────────────────────────────────────────
  loadUnavailableDates(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = this.currentYear();
    const month = this.currentMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const unavailable: Date[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date < today) {
        unavailable.push(date);
      }
    }
    this.unavailableDates.set(unavailable);
  }

  bookProperty(): void {
    // Not logged in → redirect to login, return to same page after
    if (!this.authService.isAuthenticated()) {
      this.close();
      this.router.navigate(['/auth/login/email'], {
        queryParams: { redirectTo: this.router.url },
      });
      return;
    }

    const viewingDate = this.selectedDate();
    if (!viewingDate) {
      this.notificationService.notify({
        message: 'Please select a viewing date to continue.',
        status: NotificationStatusEnum.ERROR,
        title: 'Date Required',
      });
      return;
    }

    // customerId comes from the authenticated user profile
    const user = this.authService.user;
    const customerId = user()?.customerId as string;
    const propertyId = this.property()?._id?.toString() as string;

    if (!customerId || !propertyId) {
      this.notificationService.notify({
        message: 'Unable to complete booking. Please try again.',
        status: NotificationStatusEnum.ERROR,
        title: 'Error',
      });
      return;
    }

    this.isLoading.set(true);

    this.bookingsService
      .createBooking({ customerId, propertyId, viewingDate })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.close();
          // Open the success modal
          this.dialog.open(BookingMessage, {
            data: { booking: res.data },
          });
        },
        error: () => {
          this.isLoading.set(false);
          this.notificationService.notify({
            message: 'Booking failed. Please try again.',
            status: NotificationStatusEnum.ERROR,
            title: 'Booking Error',
          });
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}