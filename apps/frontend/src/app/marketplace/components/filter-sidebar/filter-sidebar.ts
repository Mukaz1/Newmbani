import {
  HttpResponseInterface,
  PropertyCategory,
  PaginatedData,
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

import { Button } from '../../../common/components/button/button';
import { CategoriesService } from '../../../categories/services/categories.service';
import { NotificationService } from '../../../common/services/notification.service';

@Component({
  selector: 'app-filter-sidebar',
  imports: [
    FormsModule,
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
    categoryId: new FormControl<string>(''),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
   
  });

  // UI state

  showFilters = input<boolean>(false);
  closeFiltersEvent = output<void>();
  filtersChanged = output<any>();

  // Data
  propertyCategoryOptions: PropertyCategory[] = [];
  categories: PropertyCategory[] = [];

  // Signals for dates & guests
  checkIn = signal<Date | null>(null);
  checkOut = signal<Date | null>(null);

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
      categoryId: '',
      minPrice: null,
      maxPrice: null,
      
    });
    // Emit an empty object to signal clearing all filter params
    this.filtersChanged.emit({});
  }


  closeFilters() {
    this.closeFiltersEvent.emit();
  }
}
