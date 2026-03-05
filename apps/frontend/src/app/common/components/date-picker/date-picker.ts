import { DatePipe } from '@angular/common';
import { Component, input, output, signal, computed } from '@angular/core';
import {
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  setHours,
  setMinutes,
  endOfWeek,
  startOfWeek,
} from 'date-fns';

@Component({
  selector: 'app-date-picker',
  imports: [DatePipe],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
})
export class DatePicker {
  currentMonth = signal(new Date());

  checkIn = input<Date | null>(null);
  checkOut = input<Date | null>(null);
  appointment = input<Date | null>(null);
  unavailableDates = input<Date[]>([]);

  activeField = input<'checkIn' | 'checkOut' | 'appointment' | null>(null);

  checkInChange = output<Date | null>();
  checkOutChange = output<Date | null>();
  appointmentChange = output<Date | null>();

  // Signals
  days = signal<Date[]>([]);
  appointmentTime = signal<string>(''); // HH:mm

  // Weekday names
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() {
    this.updateDays();
  }

  nextMonth() {
    this.currentMonth.set(addMonths(this.currentMonth(), 1));
    this.updateDays();
  }

  prevMonth() {
    this.currentMonth.set(addMonths(this.currentMonth(), -1));
    this.updateDays();
  }

  private updateDays() {
    const start = startOfWeek(startOfMonth(this.currentMonth()), {
      weekStartsOn: 0,
    });
    const end = endOfWeek(endOfMonth(this.currentMonth()), { weekStartsOn: 0 });
    this.days.set(eachDayOfInterval({ start, end }));
  }
  // Computed signal to use in template
  daysInMonth = computed(() => this.days());

  selectDate(date: Date) {
    const field = this.activeField();

    if (field === 'appointment') {
      // If time already chosen, merge into Date
      if (this.appointmentTime()) {
        const [hours, minutes] = this.appointmentTime().split(':').map(Number);
        const fullDate = setMinutes(setHours(date, hours), minutes);
        this.appointmentChange.emit(fullDate);
      } else {
        this.appointmentChange.emit(date);
      }
      return;
    }

    if (field === 'checkIn') {
      this.checkInChange.emit(date);

      // if user picks check-in after check-out, reset checkout
      if (this.checkOut() && date > this.checkOut()!) {
        this.checkOutChange.emit(null);
      }
      return;
    }

    if (field === 'checkOut') {
      // Only allow if check-in exists
      if (this.checkIn() && date > this.checkIn()!) {
        this.checkOutChange.emit(date);
      } else {
        // otherwise reset flow
        this.checkInChange.emit(date);
        this.checkOutChange.emit(null);
      }
      return;
    }
  }

  onTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.appointmentTime.set(input.value);

    if (this.appointment()) {
      const [hours, minutes] = input.value.split(':').map(Number);
      const fullDate = setMinutes(
        setHours(this.appointment()!, hours),
        minutes
      );
      this.appointmentChange.emit(fullDate);
    }
  }

  isSelected(date: Date): boolean {
    return !!(
      (this.checkIn() &&
        date.toDateString() === this.checkIn()!.toDateString()) ||
      (this.checkOut() &&
        date.toDateString() === this.checkOut()!.toDateString()) ||
      (this.appointment() &&
        date.toDateString() === this.appointment()!.toDateString())
    );
  }

  isInRange(date: Date): boolean {
    if (this.checkIn() && this.checkOut()) {
      const d = date.getTime();
      return d > this.checkIn()!.getTime() && d < this.checkOut()!.getTime();
    }
    return false;
  }

  isUnavailable(day: Date): boolean {
    if (!day) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const unavailableDates: Date[] = this.unavailableDates() || [];
    // normalize input
    const d = new Date(day);
    d.setHours(0, 0, 0, 0);

    // Set unavailable as past dates and dates received
    if (d < today) return true;

    // Check if day is in unavailable date list
    return unavailableDates.some((unavailable) => {
      const u = new Date(unavailable);
      u.setHours(0, 0, 0, 0);
      return d.getTime() === u.getTime();
    });
  }
}
