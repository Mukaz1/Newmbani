import {
  HttpResponseInterface,
  PropertyCategory,
  PropertySubCategory,
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
import { CategoriesService } from '../../../admin/pages/categories/services/categories.service';
import { NotificationService } from '../../../common/services/notification.service';

@Component({
  selector: 'app-filter-sidebar',
  imports: [FormsModule, Button, ReactiveFormsModule],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss',
})
export class FilterSidebar implements OnInit {
  private categoriesService = inject(CategoriesService);
  private notificationService = inject(NotificationService);

  filtersForm = new FormGroup({
    location: new FormControl<string>(''),
    categoryId: new FormControl<string>(''),
    subcategoryId: new FormControl<string>({ value: '', disabled: true }), // ✅ disabled until category selected
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    rating: new FormControl<number | null>(null),
    isAvailable: new FormControl<boolean | null>(null),
  });

  showFilters = input<boolean>(false);
  closeFiltersEvent = output<void>();
  filtersChanged = output<any>();

  categories: PropertyCategory[] = [];
  subcategories: PropertySubCategory[] = [];
  filteredSubcategories: PropertySubCategory[] = [];

  ngOnInit() {
    this.fetchCategories();
    this.fetchSubcategories();

    // ✅ enable/disable subcategory and filter list based on selected category
    this.filtersForm.get('categoryId')?.valueChanges.subscribe((categoryId) => {
      this.filtersForm.patchValue({ subcategoryId: '' });
      if (categoryId) {
        this.filteredSubcategories = this.subcategories.filter(
          (s) => s.categoryId === categoryId,
        );
        this.filtersForm.get('subcategoryId')?.enable();
      } else {
        this.filteredSubcategories = [];
        this.filtersForm.get('subcategoryId')?.disable();
      }
    });
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res: HttpResponseInterface<PaginatedData<PropertyCategory[]>>) => {
        this.categories = res.data?.data ?? [];
      },
      error: (error) => console.error(error),
    });
  }

  fetchSubcategories() {
    this.categoriesService.getSubcategories().subscribe({
      next: (res: HttpResponseInterface<PaginatedData<PropertySubCategory[]>>) => {
        this.subcategories = res.data?.data ?? [];
      },
      error: (error) => console.error(error),
    });
  }

  updateFilters() {
    // ✅ getRawValue includes disabled controls (subcategoryId)
    const raw = this.filtersForm.getRawValue();

    const filters: Record<string, any> = {};

    if (raw.location?.trim()) filters['location'] = raw.location.trim();
    if (raw.categoryId) filters['categoryId'] = raw.categoryId;
    if (raw.subcategoryId) filters['subcategoryId'] = raw.subcategoryId;
    if (raw.minPrice != null && raw.minPrice > 0) filters['minPrice'] = raw.minPrice;
    if (raw.maxPrice != null && raw.maxPrice > 0) filters['maxPrice'] = raw.maxPrice;
    if (raw.rating != null && raw.rating > 0) filters['rating'] = raw.rating;
    if (raw.isAvailable != null) filters['isAvailable'] = raw.isAvailable;

    this.filtersChanged.emit(filters);
  }

  resetFilters() {
    this.filtersForm.reset({
      location: '',
      categoryId: '',
      subcategoryId: '',
      minPrice: null,
      maxPrice: null,
      rating: null,
      isAvailable: null,
    });
    this.filteredSubcategories = [];
    this.filtersForm.get('subcategoryId')?.disable();
    this.filtersChanged.emit({});
  }

  closeFilters() {
    this.closeFiltersEvent.emit();
  }
}