import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Property, PropertyCategory, CreateProperty, NotificationStatusEnum, HttpResponseInterface, PropertyWaterEnum, PropertyElectricityEnum } from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, take, takeUntil,  } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';
import { CountriesService } from '../../../countries/services/countries.service';
import { SearchableSelectOption } from '../../../marketplace/components/searchable-select/searchable-select';
import { PropertiesService } from '../../services/properties.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-properties',
  imports: [],
  templateUrl: './manage-properties.html',
  styleUrl: './manage-properties.css',
})
export class ManageProperty implements OnInit {
  isLoading = signal(false);
  property = signal<Property | null>(null);
  categories = signal<PropertyCategory[]>([]);
  selectedCategory = signal<PropertyCategory | undefined>(undefined);

  propertyForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    subcategoryId: new FormControl('', [Validators.required]),
    rentPrice: new FormControl(0, [Validators.required]),
    deposit: new FormControl(0, [Validators.required]),
    availableUnits:new FormControl(0, [Validators.required]),
    isAvailable:new FormControl(true, [Validators.required]),
    map: new FormGroup({
      lat: new FormControl(0, [Validators.required]),
      lng: new FormControl(0, [Validators.required]),
    }),
    features: new FormGroup({
      water: new FormControl('', [Validators.required]),
      security: new FormControl('', [Validators.required]),
      electricity: new FormControl('', [Validators.required]),
    }),
    address: new FormGroup({
      countryId: new FormControl('', [Validators.required]),
      county: new FormControl('', [Validators.required]),
      town: new FormControl(''),
      street: new FormControl(''),
      building: new FormControl(''),
    }),
  });

  private destroy$ = new Subject();
  private propertiesService = inject(PropertiesService);
  private notificationService = inject(NotificationService);
  private readonly countrieService = inject(CountriesService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  countries = this.countrieService.allCountries;
  countryOptions = computed(() =>
    this.countries().map(
      (country): SearchableSelectOption => ({
        label: country.name,
        value: country.name,
        description: country.code,
      })
    )
  );
  currentUser = this.authService.user;
  currentYear = new Date().getFullYear();

  constructor() {
    this.propertyForm
      .get('categoryId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((categoryId) => {
        this.selectedCategory.set(
          this.categories().find((cat) => cat._id.toString() === categoryId)
        );
        this.propertyForm.get('subcategoryId')?.patchValue('');
      });
  }

  ngOnInit(): void {

   const propertyId = this.route.snapshot.paramMap.get('id')
   if (propertyId){
     this.getProperty(propertyId)
   }
    this.fetchCategories();
  }

  getProperty(propertyId: string): void {
    this.isLoading.set(true);

    this.propertiesService
      .getPropertyByIdOrSlug(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponseInterface<Property>) => {
          this.isLoading.set(false);
          this.property.set(response.data);
          this.selectedCategory.set(this.property()?.category);
          this.propertyForm.patchValue({
            title: this.property()?.title ?? '',
            description: this.property()?.description ?? '',
            categoryId: this.property()?.categoryId ?? '',
            subcategoryId: this.property()?.subcategoryId ?? '',
            isAvailable: this.property()?.isAvailable ?? false,
            availableUnits: this.property()?.availableUnits ?? 0,
            map: {
              lat: this.property()?.map.lat ?? 0,
              lng: this.property()?.map.lng ?? 0,
            },
            features: {
              water: this.property()?.features.water ?? undefined,
              electricity: this.property()?.features.electricity ?? undefined,
              security: this.property()?.features.security ?? '',
            },
            address: {
              countryId: this.property()?.address.countryId || undefined,
              county: this.property()?.address.county || '',
              town: this.property()?.address.town ?? '',
              street: this.property()?.address.town ?? '',
              building: this.property()?.address.town ?? '',
            },
          });

        },
        error: (error: HttpErrorResponse) => {
          console.error('API Error occurred:', error);
          this.isLoading.set(false);
        },
      });
    }

    fetchCategories() {
    this.categoriesService
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.categories.set(res.data.data);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
  }

  submit() {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    const landlordId = this.currentUser()?.landlordId
    this.isLoading.set(true);

    // Prepare payload for API
    const { categoryId, description, title, subcategoryId, isAvailable, availableUnits, rentPrice, deposit } =
      this.propertyForm.value;
    const { lat, lng } = this.propertyForm.controls.map.value;
    const { electricity, water, security} =  this.propertyForm.controls.features.value;
    const { countryId, county, town, street, building} =  this.propertyForm.controls.address.value;
if(landlordId){
  const payload: CreateProperty = {
    title: title ?? '',
    landlordId: landlordId ,
    description: description ?? '',
    categoryId: categoryId ?? '',
    subcategoryId: subcategoryId ?? '',
    isAvailable: isAvailable ?? false,
    availableUnits: availableUnits ?? 0,
    rentPrice: rentPrice ?? 0,
    deposit: deposit ?? 0,

    map: {
      lat: lat ?? 0,
      lng: lng ?? 0,
    },
    address: {
      countryId: countryId || '',
      county: county || '',
      town: town || '',
      street: street || '',
      building : building || ''
    },
    features: {
      security: security ??'',
      water: (water as PropertyWaterEnum) ?? PropertyWaterEnum.OTHER,
      electricity: (electricity as PropertyElectricityEnum) ?? PropertyElectricityEnum.OTHER,
      
    },
  };

  if (this.property()) {
    // Update existing property
    this.propertiesService
      .updateProperty(this.property()!._id, payload)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.router.navigate([`/landlord/properties/${res.data._id}`])

        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message:
              error.error.message || 'Failed to update property listing',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  } else {
    this.propertiesService
      .createProperty(payload)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.router.navigate([`/landlord/properties/${res.data._id}`])
       },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message:
              error.error.message || 'Failed to create property listing',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }
}
  }
}
