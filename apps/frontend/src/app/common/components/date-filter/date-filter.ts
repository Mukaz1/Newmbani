import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  DateRange,
  DateFilterConfig,
  QuickFilterOption,
  DateFilterEvent,
} from '@newmbani/types';

@Component({
  selector: 'app-date-filter',
  imports: [FormsModule],
  templateUrl: './date-filter.html',
  styleUrl: './date-filter.scss',
})
export class DateFilter {
  @Input() config: DateFilterConfig = {};
  @Input() set dateRange(value: DateRange) {
    this._dateRange.set(value);
  }
  @Output() dateRangeChange = new EventEmitter<DateFilterEvent>();

  // Internal state
  _dateRange = signal<DateRange>({ startDate: null, endDate: null });
  showDatePicker = signal(false);
  showQuickFilters = signal(false);
  selectedQuickFilter = signal<string>('');

  // Computed values
  displayValue = computed(() => {
    const range = this._dateRange();
    if (!range.startDate && !range.endDate) {
      return this.config.placeholder || 'Select date range';
    }

    if (range.startDate && range.endDate) {
      const start = this.formatDate(range.startDate);
      const end = this.formatDate(range.endDate);
      return `${start} - ${end}`;
    }

    if (range.startDate) {
      return `From ${this.formatDate(range.startDate)}`;
    }

    if (range.endDate) {
      return `Until ${this.formatDate(range.endDate)}`;
    }

    return this.config.placeholder || 'Select date range';
  });

  // Helper computed values for template
  startDateValue = computed(() => {
    const startDate = this._dateRange().startDate;
    return startDate ? startDate.toISOString().split('T')[0] : '';
  });

  endDateValue = computed(() => {
    const endDate = this._dateRange().endDate;
    return endDate ? endDate.toISOString().split('T')[0] : '';
  });

  minDateValue = computed(() => {
    return this.config.minDate
      ? this.config.minDate.toISOString().split('T')[0]
      : '';
  });

  maxDateValue = computed(() => {
    return this.config.maxDate
      ? this.config.maxDate.toISOString().split('T')[0]
      : '';
  });

  // Quick filter options
  quickFilters: QuickFilterOption[] = [
    {
      label: 'Today',
      value: 'today',
      getDateRange: () => {
        const today = new Date();
        return { startDate: today, endDate: today };
      },
    },
    {
      label: 'Yesterday',
      value: 'yesterday',
      getDateRange: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return { startDate: yesterday, endDate: yesterday };
      },
    },
    {
      label: 'Last 7 days',
      value: 'last7days',
      getDateRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: 'Last 30 days',
      value: 'last30days',
      getDateRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: 'This month',
      value: 'thisMonth',
      getDateRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: 'Last month',
      value: 'lastMonth',
      getDateRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { startDate: start, endDate: end };
      },
    },
  ];

  toggleDatePicker() {
    if (!this.config.disabled) {
      this.showDatePicker.update((show) => !show);
      this.showQuickFilters.set(false);
    }
  }

  toggleQuickFilters() {
    if (!this.config.disabled) {
      this.showQuickFilters.update((show) => !show);
      this.showDatePicker.set(false);
    }
  }

  onStartDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const date = target.value ? new Date(target.value) : null;

    this._dateRange.update((range) => ({
      ...range,
      startDate: date,
    }));

    this.emitChange('date');
  }

  onEndDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const date = target.value ? new Date(target.value) : null;

    this._dateRange.update((range) => ({
      ...range,
      endDate: date,
    }));

    this.emitChange('date');
  }

  onQuickFilterSelect(filter: QuickFilterOption) {
    const dateRange = filter.getDateRange();
    this._dateRange.set(dateRange);
    this.selectedQuickFilter.set(filter.value);
    this.showQuickFilters.set(false);
    this.emitChange('quick-filter', filter.value);
  }

  clearDateRange() {
    this._dateRange.set({ startDate: null, endDate: null });
    this.selectedQuickFilter.set('');
    this.emitChange('date');
  }

  private emitChange(filterType: 'date' | 'quick-filter', value?: string) {
    const event: DateFilterEvent = {
      dateRange: this._dateRange(),
      filterType,
      value: value || '',
    };
    this.dateRangeChange.emit(event);
  }

  private formatDate(date: Date): string {
    if (!date) return '';

    const format = this.config.format || 'MMM dd, yyyy';

    // Simple date formatting - you can enhance this with a date library
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  // Close dropdowns when clicking outside
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-filter-container')) {
      this.showDatePicker.set(false);
      this.showQuickFilters.set(false);
    }
  }
}
