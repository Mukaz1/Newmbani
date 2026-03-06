import {
  Guests,
  GuestTypeEnum,
  HttpResponseInterface,
  PropertyCategory,
  PaginatedData,
  NotificationStatusEnum,
  PropertyListingTypeEnum,
} from '@newmbani/types';

import {
  Component,
  inject,
  OnInit,
  signal,
  output,
  input,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { GuestPicker } from '../../pages/listings/components/guest-picker/guest-picker';
import { DatePicker } from '../../../common/components/date-picker/date-picker';
import { DatePipe } from '@angular/common';
import { Button } from '../../../common/components/button/button';
import { CategoriesService } from '../../../categories/services/categories.service';
import { NotificationService } from '../../../common/services/notification.service';

@Component({
  selector: 'app-filter-sidebar',
  imports: [
    FormsModule,
    GuestPicker,
    DatePicker,
    DatePipe,
    Button,
    ReactiveFormsModule,
  ],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss',
})
export class FilterSidebar implements OnInit {
  private categoriesService = inject(CategoriesService);
  private notificationService = inject(NotificationService);

  filtersForm = new FormGroup({
    location: new FormControl<string>(''),
    type: new FormControl<PropertyListingTypeEnum | ''>(''),
    categoryId: new FormControl<string>(''),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    bedrooms: new FormControl<number | null>(null),
    bathrooms: new FormControl<number | null>(null),
    guestsType: new FormGroup({
      [GuestTypeEnum.ADULTS]: new FormControl<number>(0),
      [GuestTypeEnum.CHILDREN]: new FormControl<number>(0),
      [GuestTypeEnum.INFANTS]: new FormControl<number>(0),
      [GuestTypeEnum.PETS]: new FormControl<number>(0),
    }),
    checkInDate: new FormControl<string | null>(null),
    checkOutDate: new FormControl<string | null>(null),
  });

  // UI state
  showDatePicker = false;
  showGuestPicker = false;
  showFilters = input<boolean>(false);
  closeFiltersEvent = output<void>();
  filtersChanged = output<any>();
  activeDateField = signal<'checkIn' | 'checkOut' | null>(null);

  // Data
  propertyCategoryOptions: PropertyCategory[] = [];
  categories: PropertyCategory[] = [];

  // Signals for dates & guests
  checkIn = signal<Date | null>(null);
  checkOut = signal<Date | null>(null);

  guests = signal<Guests>({
    [GuestTypeEnum.ADULTS]: 0,
    [GuestTypeEnum.CHILDREN]: 0,
    [GuestTypeEnum.INFANTS]: 0,
    [GuestTypeEnum.PETS]: 0,
  });

  // Enums exposed for template
  PropertyListingTypeEnum = PropertyListingTypeEnum;
  types = Object.values(PropertyListingTypeEnum);
  guestType = Object.values(GuestTypeEnum);

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res: HttpResponseInterface<PaginatedData<PropertyCategory[]>>) => {
        this.categories = res.data?.data ?? [];
        this.propertyCategoryOptions = res.data?.data ?? [];
      },
      error: (error) => console.error(error),
    });
  }

  /**
   * Emit only non-empty filters: Only send filters that have a value which is not
   * null or undefined. For objects, recursively remove all null/undefined empty subvalues.
   */
  updateFilters() {
    const filters = this.filtersForm.value;
    const cleanFilters = this.removeEmptyValues(filters);
    this.filtersChanged.emit(cleanFilters);
  }

  /**
   * Helper: Deeply removes all null/undefined/empty-string fields,
   * and for guestsType, only sends if any values > 0.
   */
  private removeEmptyValues(obj: any): any {
    if (obj == null) return undefined;
    if (Array.isArray(obj)) {
      return obj
        .map((item) => this.removeEmptyValues(item))
        .filter((item) => item != null);
    }
    if (typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (
          key === 'guestsType' &&
          typeof value === 'object' &&
          value !== null
        ) {
          // Only include guestsType if any value > 0
          const filtered = Object.fromEntries(
            Object.entries(value).filter(
              ([, v]) => typeof v === 'number' && v > 0
            )
          );
          if (Object.keys(filtered).length > 0) {
            result[key] = filtered;
          }
        } else if (
          value !== null &&
          value !== undefined &&
          !(typeof value === 'string' && value.trim() === '')
        ) {
          // For nested objects, deep clean
          if (typeof value === 'object' && !Array.isArray(value)) {
            const cleanedObj = this.removeEmptyValues(value);
            if (
              cleanedObj &&
              ((typeof cleanedObj === 'object' &&
                Object.keys(cleanedObj).length > 0) ||
                (typeof cleanedObj !== 'object' && cleanedObj != null))
            ) {
              result[key] = cleanedObj;
            }
          } else {
            result[key] = value;
          }
        }
      }
      return Object.keys(result).length > 0 ? result : undefined;
    }
    return obj;
  }

  resetFilters() {
    this.filtersForm.reset({
      location: '',
      type: '',
      categoryId: '',
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null,
      guestsType: {
        [GuestTypeEnum.ADULTS]: 0,
        [GuestTypeEnum.CHILDREN]: 0,
        [GuestTypeEnum.INFANTS]: 0,
        [GuestTypeEnum.PETS]: 0,
      },
      checkInDate: null,
      checkOutDate: null,
    });
    // Emit an empty object to signal clearing all filter params
    this.filtersChanged.emit({});
  }

  onDatesChange(dates: { checkIn: Date | null; checkOut: Date | null }) {
    this.checkIn.set(dates.checkIn);
    this.checkOut.set(dates.checkOut);

    this.filtersForm.patchValue({
      checkInDate: dates.checkIn ? dates.checkIn.toISOString() : null,
      checkOutDate: dates.checkOut ? dates.checkOut.toISOString() : null,
    });

    this.updateFilters();
  }

  onGuestsChange(updatedGuests: Guests) {
    this.guests.set(updatedGuests);
    this.filtersForm.patchValue({ guestsType: updatedGuests });
    this.updateFilters();
  }

  toggleDateField(field: 'checkIn' | 'checkOut') {
    this.activeDateField.set(this.activeDateField() === field ? null : field);
  }

  toggleGuestPicker() {
    this.showGuestPicker = !this.showGuestPicker;
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  closeFilters() {
    this.closeFiltersEvent.emit();
  }
}
