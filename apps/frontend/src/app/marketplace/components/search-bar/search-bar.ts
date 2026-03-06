import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

import { NotificationService } from '../../../common/services/notification.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { GuestPicker } from '../../pages/listings/components/guest-picker/guest-picker';
import { DatePicker } from '../../../common/components/date-picker/date-picker';
import { Button } from '../../../common/components/button/button';

import {
  Guests,
  GuestTypeEnum,
  HttpResponseInterface,
  NotificationStatusEnum,
  PaginatedData,
  PropertyCategory,
  PropertyListingTypeEnum,
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

  PropertyListingTypeEnum = PropertyListingTypeEnum;

  searchForm!: FormGroup;
  activeTab: PropertyListingTypeEnum = PropertyListingTypeEnum.BNB;
  activeDateField: 'checkIn' | 'checkOut' | null = null;
  // today = '';

  propertyCategoryOptions: PropertyCategory[] = [];
  categories: PropertyCategory[] = [];

  guests = signal<Guests>({
    [GuestTypeEnum.ADULTS]: 0,
    [GuestTypeEnum.CHILDREN]: 0,
    [GuestTypeEnum.INFANTS]: 0,
    [GuestTypeEnum.PETS]: 0,
  });

  showGuestPicker = false;
  showDatePicker = false;

  ngOnInit() {
    this.loadCategories();
    // this.today = new Date().toISOString().split('T')[0];
    this.searchForm = this.fb.group({
      location: [''],
      type: [this.activeTab],
      checkIn: [''],
      checkOut: [''],
      bedrooms: [0],
      bathrooms: [0],
      minPrice: [0],
      maxPrice: [0],
      categoryId: [''],
      guestsType: this.fb.group({
        [GuestTypeEnum.ADULTS]: [0],
        [GuestTypeEnum.CHILDREN]: [0],
        [GuestTypeEnum.INFANTS]: [0],
        [GuestTypeEnum.PETS]: [0],
      }),
    });
  }

  setActiveTab(tab: PropertyListingTypeEnum) {
    this.activeTab = tab;
    this.searchForm.get('type')?.setValue(tab);
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

  onGuestsChange(updatedGuests: Guests) {
    this.guests.set(updatedGuests);
    this.searchForm.get('guestsType')?.patchValue(updatedGuests);
  }

  getGuestsLabel(guests: Guests): string {
    if (!guests) return 'Guests';
    const parts: string[] = [];
    if (guests[GuestTypeEnum.ADULTS] > 0)
      parts.push(
        `${guests[GuestTypeEnum.ADULTS]} ${
          guests[GuestTypeEnum.ADULTS] === 1 ? 'Adult' : 'Adults'
        }`
      );
    if (guests[GuestTypeEnum.CHILDREN] > 0)
      parts.push(
        `${guests[GuestTypeEnum.CHILDREN]} ${
          guests[GuestTypeEnum.CHILDREN] === 1 ? 'Child' : 'Children'
        }`
      );
    if (guests[GuestTypeEnum.INFANTS] > 0)
      parts.push(
        `${guests[GuestTypeEnum.INFANTS]} ${
          guests[GuestTypeEnum.INFANTS] === 1 ? 'Infant' : 'Infants'
        }`
      );
    if (guests[GuestTypeEnum.PETS] > 0)
      parts.push(
        `${guests[GuestTypeEnum.PETS]} ${
          guests[GuestTypeEnum.PETS] === 1 ? 'Pet' : 'Pets'
        }`
      );
    return parts.length > 0 ? parts.join(', ') : 'Guests';
  }

  openDatePicker(field: 'checkIn' | 'checkOut') {
    this.activeDateField = this.activeDateField === field ? null : field;
  }

  closeDatePicker() {
    this.activeDateField = null;
  }

  private validateDates(): boolean {
    const checkIn = this.searchForm.get('checkIn')?.value;
    const checkOut = this.searchForm.get('checkOut')?.value;
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      if (outDate <= inDate) {
        this.notificationService.notify({
          message: 'Check-out date must be after check-in date',
          status: NotificationStatusEnum.WARNING,
          title: 'Warning',
        });
        return false;
      }
    }
    return true;
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
    if (!this.validateDates() || !this.validatePrices()) {
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
      type: this.activeTab,
      ...(raw.location && raw.location.trim() && { location: raw.location }),
      ...(raw.bedrooms && raw.bedrooms > 0 && { bedrooms: raw.bedrooms }),
      ...(raw.bathrooms && raw.bathrooms > 0 && { bathrooms: raw.bathrooms }),
    };

    if (this.activeTab === PropertyListingTypeEnum.BNB) {
      if (raw.checkIn) queryParams.checkIn = raw.checkIn;
      if (raw.checkOut) queryParams.checkOut = raw.checkOut;
      Object.assign(queryParams, guestsParams);
    }

    if (this.activeTab === PropertyListingTypeEnum.SALE) {
      if (raw.minPrice && raw.minPrice > 0) queryParams.minPrice = raw.minPrice;
      if (raw.maxPrice && raw.maxPrice > 0) queryParams.maxPrice = raw.maxPrice;
      if (raw.category) queryParams.category = raw.category;
    }
    this.router.navigate(['/listings'], { queryParams });
  }
}
