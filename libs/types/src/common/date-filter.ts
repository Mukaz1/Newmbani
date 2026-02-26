export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

export interface DateFilterConfig {
    placeholder?: string;
    showTimePicker?: boolean;
    showQuickFilters?: boolean;
    minDate?: Date;
    maxDate?: Date;
    format?: string;
    disabled?: boolean;
    required?: boolean;
    clearable?: boolean;
}

export interface QuickFilterOption {
    label: string;
    value: string;
    getDateRange: () => DateRange;
}

export interface DateFilterEvent {
    dateRange: DateRange;
    filterType: 'date' | 'quick-filter';
    value: string;
} 