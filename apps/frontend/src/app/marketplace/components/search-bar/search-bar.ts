import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

import { NotificationService } from '../../../common/services/notification.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { GuestPicker } from '../../pages/properties/components/guest-picker/guest-picker';
import { DatePicker } from '../../../common/components/date-picker/date-picker';
import { Button } from '../../../common/components/button/button';

import {
  HttpResponseInterface,
  NotificationStatusEnum,
  PaginatedData,
  PropertyCategory,
} from '@newmbani/types';

@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule,
    GuestPicker,
    DatePicker,
    DatePipe,
    Button,
    NgClass,
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit {
  private router = inject(Router);
  private categoriesService = inject(CategoriesService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);


  searchForm!: FormGroup;
  // today = '';

  propertyCategoryOptions: PropertyCategory[] = [];
  categories: PropertyCategory[] = [];


  ngOnInit() {
    this.loadCategories();
    // this.today = new Date().toISOString().split('T')[0];
    this.searchForm = this.fb.group({
      location: [''],
      minPrice: [0],
      maxPrice: [0],
      categoryId: [''],
      
    });
  }

 
  private loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res: HttpResponseInterface<PaginatedData<PropertyCategory[]>>) => {
        const data = res.data?.data ?? [];
        this.categories = data;
        this.propertyCategoryOptions = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

 
  private validatePrices(): boolean {
    const min = this.searchForm.get('minPrice')?.value;
    const max = this.searchForm.get('maxPrice')?.value;
    if (!isNaN(min) && !isNaN(max) && min > max) {
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
    if (!this.validatePrices()) {
      return;
    }
    const raw = this.searchForm.getRawValue();

    // Safely extract guests parameters
    const guestsParams: Record<string, number> = {};
    if (raw.guestsType && typeof raw.guestsType === 'object') {
      Object.entries(raw.guestsType).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0) {
          guestsParams[key] = value;
        }
      });
    }

    // Build parameters object, only including meaningful values
    const queryParams: any = {
      ...(raw.location && raw.location.trim() && { location: raw.location }),
      ...(raw.bedrooms && raw.bedrooms > 0 && { bedrooms: raw.bedrooms }),
      ...(raw.bathrooms && raw.bathrooms > 0 && { bathrooms: raw.bathrooms }),
      ...(raw.minPrice && raw.minPrice > 0 && { minPrice :raw.minPrice}),
      ...(raw.maxPrice && raw.maxPrice > 0 && { maxPrice :raw.maxPrice}),
      ...(raw.category && { category :raw.category}),
    };

   
    this.router.navigate(['/properties'], { queryParams });
  }
}
