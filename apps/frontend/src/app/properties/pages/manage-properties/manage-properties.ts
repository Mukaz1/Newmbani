import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Property,
  PropertyCategory,
  CreateProperty,
  NotificationStatusEnum,
  HttpResponseInterface,
  PropertyWaterEnum,
  PropertyElectricityEnum,
} from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';
import { CountriesService } from '../../../countries/services/countries.service';
import { PropertiesService } from '../../services/properties.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { Button } from '../../../common/components/button/button';

@Component({
  selector: 'app-manage-properties',
  imports: [ReactiveFormsModule, DataLoading, Button],
  templateUrl: './manage-properties.html',
  styleUrl: './manage-properties.css',
})
export class ManageProperty implements OnInit, OnDestroy {
  isLoading = signal(false);
  property = signal<Property | null>(null);
  categories = signal<PropertyCategory[]>([]);
  selectedCategory = signal<PropertyCategory | undefined>(undefined);

  // Dropdown options derived from enums
  readonly waterOptions = Object.values(PropertyWaterEnum).map((v) => ({
    value: v,
    label: v.replace(/_/g, ' '),
  }));

  readonly electricityOptions = Object.values(PropertyElectricityEnum).map(
    (v) => ({
      value: v,
      label: v.replace(/_/g, ' '),
    }),
  );

  propertyForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    subcategoryId: new FormControl('', [Validators.required]),
    rentPrice: new FormControl(0, [Validators.required]),
    deposit: new FormControl(0, [Validators.required]),
    availableUnits: new FormControl(0, [Validators.required]),
    isAvailable: new FormControl(true, [Validators.required]),
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

  private destroy$ = new Subject<void>();
  private propertiesService = inject(PropertiesService);
  private notificationService = inject(NotificationService);
  private readonly countriesService = inject(CountriesService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  countries = this.countriesService.allCountries;
  currentUser = this.authService.user;

  constructor() {
    // When category changes: reset subcategory + resolve selectedCategory
    this.propertyForm
      .get('categoryId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((categoryId) => {
        this.selectedCategory.set(
          this.categories().find((c) => c._id.toString() === categoryId),
        );
        this.propertyForm.get('subcategoryId')?.patchValue('');
      });
  }

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.getProperty(propertyId);
    }
    this.fetchCategories();
  }

  goBack(): void {
    if (this.authService.getUserType().admin) {
      this.router.navigate(['/admin/properties']);
    } else {
      this.router.navigate(['/landlord/properties']);
    }
  }

  getProperty(propertyId: string): void {
    this.isLoading.set(true);
    this.propertiesService
      .getPropertyByIdOrSlug(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponseInterface<Property>) => {
          this.isLoading.set(false);
          const prop = response.data;
          this.property.set(prop);
          this.selectedCategory.set(prop.category);
          this.propertyForm.patchValue({
            title: prop.title ?? '',
            description: prop.description ?? '',
            categoryId: prop.categoryId ?? '',
            subcategoryId: prop.subcategoryId ?? '',
            isAvailable: prop.isAvailable ?? false,
            availableUnits: prop.availableUnits ?? 0,
            rentPrice: prop.rentPrice ?? 0,
            deposit: prop.deposit ?? 0,
            map: {
              lat: prop.map?.lat ?? 0,
              lng: prop.map?.lng ?? 0,
            },
            features: {
              water: prop.features?.water ?? '',
              electricity: prop.features?.electricity ?? '',
              security: prop.features?.security ?? '',
            },
            address: {
              countryId: prop.address?.countryId || '',
              county: prop.address?.county || '',
              town: prop.address?.town ?? '',
              street: prop.address?.street ?? '',
              building: prop.address?.building ?? '',
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message: error.error?.message || 'Failed to load property',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  fetchCategories(): void {
    this.categoriesService
      .getCategories()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          const categories = res.data.data;
          this.categories.set(categories);

          // Fetch all subcategories once and attach them to their parent category
          this.categoriesService
            .getSubcategories()
            .pipe(take(1))
            .subscribe({
              next: (subRes) => {
                const subs = subRes.data.data;
                const byCat = new Map<string, typeof subs>();
                subs.forEach((s: any) => {
                  const cid = s.categoryId?.toString?.() ?? s.categoryId;
                  const arr = byCat.get(cid) ?? [];
                  arr.push(s);
                  byCat.set(cid, arr);
                });

                // attach subcategories to categories
                const categoriesWithSubs = categories.map((c) => ({
                  ...c,
                  subCategories: byCat.get(c._id?.toString?.() ?? c._id) ?? [],
                }));

                this.categories.set(categoriesWithSubs);

                // Re-resolve selectedCategory after categories + subcategories load (needed for edit mode)
                const categoryId = this.propertyForm.get('categoryId')?.value;
                if (categoryId) {
                  this.selectedCategory.set(
                    this.categories().find(
                      (c) => c._id.toString() === categoryId,
                    ),
                  );
                }
              },
              error: () => {
                // If subcategories fail, still set selectedCategory based on categories
                const categoryId = this.propertyForm.get('categoryId')?.value;
                if (categoryId) {
                  this.selectedCategory.set(
                    this.categories().find(
                      (c) => c._id.toString() === categoryId,
                    ),
                  );
                }
              },
            });
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  submit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      this.notificationService.notify({
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    const landlordId = this.currentUser()?.landlordId;
    if (!landlordId) {
      this.notificationService.notify({
        title: 'Error',
        message: 'Landlord account not found. Please log in again.',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    this.isLoading.set(true);

    const {
      categoryId,
      description,
      title,
      subcategoryId,
      isAvailable,
      availableUnits,
      rentPrice,
      deposit,
    } = this.propertyForm.value;
    const { lat, lng } = this.propertyForm.controls.map.value;
    const { electricity, water, security } =
      this.propertyForm.controls.features.value;
    const { countryId, county, town, street, building } =
      this.propertyForm.controls.address.value;

    const payload: CreateProperty = {
      title: title ?? '',
      landlordId,
      description: description ?? '',
      categoryId: categoryId ?? '',
      subcategoryId: subcategoryId ?? '',
      isAvailable: isAvailable ?? false,
      availableUnits: availableUnits ?? 0,
      rentPrice: rentPrice ?? 0,
      deposit: deposit ?? 0,
      map: { lat: lat ?? 0, lng: lng ?? 0 },
      address: {
        countryId: countryId || '',
        county: county || '',
        town: town || '',
        street: street || '',
        building: building || '',
      },
      features: {
        security: security ?? '',
        water: (water as PropertyWaterEnum) ?? PropertyWaterEnum.OTHER,
        electricity:
          (electricity as PropertyElectricityEnum) ??
          PropertyElectricityEnum.OTHER,
      },
    };

    if (this.property()) {
      // ── Update ──
      this.propertiesService
        .updateProperty(this.property()!._id, payload)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              title: 'Updated',
              message: 'Property updated successfully.',
              status: NotificationStatusEnum.SUCCESS,
            });
            this.router.navigate([`/landlord/properties/${res.data._id}`]);
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              title: 'Error',
              message: error.error?.message || 'Failed to update property',
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    } else {
      // ── Create ──
      this.propertiesService
        .createProperty(payload)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              title: 'Created',
              message:
                'Property created. You can now upload images from the property page.',
              status: NotificationStatusEnum.SUCCESS,
            });
            // Navigate to view page so landlord can upload images immediately
            this.router.navigate([`/landlord/properties/${res.data._id}`]);
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              title: 'Error',
              message: error.error?.message || 'Failed to create property',
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
