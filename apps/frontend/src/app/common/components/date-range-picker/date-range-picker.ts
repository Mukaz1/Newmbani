import { DateRange } from '@newmbani/types';
import { DatePipe } from '@angular/common';
import { Component, Input, Output, signal } from '@angular/core';
@Component({
  selector: 'app-date-range-picker',
  imports: [DatePipe],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss',
})
export class DateRangePicker {
  @Input() label?: string;

  @Output() rangeChange = signal<DateRange>({ startDate: null, endDate: null });

  range = signal<DateRange>({ startDate: null, endDate: null });

  open = signal(false);
  today = new Date();
  currentMonth = signal(this.today.getMonth());
  currentYear = signal(this.today.getFullYear());

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  toggle() {
    this.open.update(o => !o);
  }

  prevMonth() {
    let m = this.currentMonth() - 1;
    let y = this.currentYear();
    if (m < 0) { m = 11; y--; }
    this.currentMonth.set(m);
    this.currentYear.set(y);
  }

  nextMonth() {
    let m = this.currentMonth() + 1;
    let y = this.currentYear();
    if (m > 11) { m = 0; y++; }
    this.currentMonth.set(m);
    this.currentYear.set(y);
  }

  daysInMonth() {
    const y = this.currentYear();
    const m = this.currentMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const numDays = new Date(y, m + 1, 0).getDate();
    const days: number[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(0);
    }
    for (let d = 1; d <= numDays; d++) {
      days.push(d);
    }
    return days;
  }

  selectDay(day: number) {
    const clicked = new Date(this.currentYear(), this.currentMonth(), day);

    const current = this.range();
    if (!current.startDate || (current.startDate && current.endDate)) {
      // start new selection
      this.range.set({ startDate: clicked, endDate: null });
    } else if (current.startDate && !current.endDate) {
      if (clicked < current.startDate) {
        // user picked earlier date -> swap
        this.range.set({ startDate: clicked, endDate: current.startDate });
      } else {
        this.range.set({ startDate: current.startDate, endDate: clicked });
      }
      this.rangeChange.set(this.range());
      this.open.set(false);
    }
  }

  isSelected(day: number): boolean {
    const sel = this.range();
    if (!sel.startDate) return false;
    const date = new Date(this.currentYear(), this.currentMonth(), day);
    const isStart = sel.startDate ? this.sameDate(date, sel.startDate) : false;
    const isEnd = sel.endDate ? this.sameDate(date, sel.endDate) : false;
    return isStart || isEnd;
  }

  isInRange(day: number): boolean {
    const sel = this.range();
    if (!sel.startDate || !sel.endDate) return false;
    const date = new Date(this.currentYear(), this.currentMonth(), day);
    return date > sel.startDate && date < sel.endDate;
  }

  sameDate(a: Date, b: Date): boolean {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }

  trackByDay(_: number, day: number) {
    return day;
  }
}

