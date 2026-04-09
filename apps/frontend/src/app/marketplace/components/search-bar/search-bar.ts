import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../common/services/notification.service';
import { CategoriesService } from '../../../admin/pages/categories/services/categories.service';
import {
  HttpResponseInterface,
  NotificationStatusEnum,
  PaginatedData,
  PropertyCategory,
  PropertySubCategory,
} from '@newmbani/types';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit {
  private router = inject(Router);
  private categoriesService = inject(CategoriesService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  searchForm!: FormGroup;
  categories: PropertyCategory[] = [];
  subcategories: PropertySubCategory[] = [];
  filteredSubcategories: PropertySubCategory[] = [];

  ngOnInit() {
    this.searchForm = this.fb.group({
      location: [''],
      minPrice: [0],
      maxPrice: [0],
      categoryId: [''],
      subcategoryId: [{ value: '', disabled: true }],
    });

    this.loadCategories();
    this.loadSubcategories();

    this.searchForm.get('categoryId')?.valueChanges.subscribe((categoryId) => {
      this.searchForm.patchValue({ subcategoryId: '' });

      if (categoryId) {
        this.filteredSubcategories = this.subcategories.filter(
          (s) => s.categoryId === categoryId,
        );
        this.searchForm.get('subcategoryId')?.enable();
      } else {
        this.filteredSubcategories = [];
        this.searchForm.get('subcategoryId')?.disable();
      }
    });
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res: HttpResponseInterface<PaginatedData<PropertyCategory[]>>) => {
        this.categories = res.data?.data ?? [];
        // ✅ flatten all subcategories from each category
        this.subcategories = this.categories.flatMap(
          (c) => (c as any).subcategories ?? [],
        );
      },
      error: (error) => console.error(error),
    });
  }

  private loadSubcategories() {
    this.categoriesService.getSubcategories().subscribe({
      next: (
        res: HttpResponseInterface<PaginatedData<PropertySubCategory[]>>,
      ) => {
        this.subcategories = res.data?.data ?? [];
      },
      error: (error) => console.error(error),
    });
  }

  private validatePrices(): boolean {
    const min = this.searchForm.get('minPrice')?.value;
    const max = this.searchForm.get('maxPrice')?.value;
    if (min > 0 && max > 0 && min > max) {
      this.notificationService.notify({
        message: 'Minimum price cannot be greater than maximum price',
        status: NotificationStatusEnum.WARNING,
        title: 'Warning',
      });
      return false;
    }
    return true;
  }

  submitSearch() {
    if (!this.validatePrices()) return;

    const raw = this.searchForm.getRawValue();

    const queryParams: Record<string, any> = {
      ...(raw.location?.trim() && { location: raw.location.trim() }),
      ...(raw.minPrice > 0 && { minPrice: raw.minPrice }),
      ...(raw.maxPrice > 0 && { maxPrice: raw.maxPrice }),
      ...(raw.categoryId && { categoryId: raw.categoryId }),
      ...(raw.subcategoryId && { subcategoryId: raw.subcategoryId }),
    };

    this.router.navigate(['/properties'], { queryParams });
  }
}
