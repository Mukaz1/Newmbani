import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  computed,
  signal,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';
import { CountriesService } from '../../../../../countries/services/countries.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { Button } from '../../../../../common/components/button/button';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Address,
  Country,
  CreateAddress,
  NotificationStatusEnum,
} from '@newmbani/types';
import { AddressesService } from '../../../../../addresses/services/addresses.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SearchableSelect,
  SearchableSelectOption,
} from '../../../../../marketplace/components/searchable-select/searchable-select';

@Component({
  selector: 'app-manage-address',
  imports: [Button, ReactiveFormsModule, SearchableSelect],
  templateUrl: './manage-address.html',
  styleUrl: './manage-address.scss',
})
export class ManageAddress implements OnInit {
  countries = signal<Country[] | []>([]);
  code = '+254';
  address: Address | undefined = undefined;
  currentCountryId: string | null = null;
  addressForm: FormGroup = new FormGroup({
    countryId: new FormControl(null, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    town: new FormControl('', [Validators.required]),
    boxAddress: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    isDefault: new FormControl(false),
  });
  isLoading = false;
  data = inject<{ address: Address }>(DIALOG_DATA);
  destroyRef = inject(DestroyRef);
  currentYear = new Date().getFullYear();
  countryOptions = computed(() =>
    this.countries().map(
      (country): SearchableSelectOption => ({
        label: country.name,
        value: country._id.toString(),
        description: country.code,
      })
    )
  );
  private readonly countriesService = inject(CountriesService);
  private readonly notificationService = inject(NotificationService);
  private readonly addressesService = inject(AddressesService);
  private readonly dilogRef = inject(DialogRef);

  constructor() {
    this.address = this.data?.address ?? undefined;
  }

  ngOnInit(): void {
    this.countries.set(this.countriesService.allCountries());
    this.addressForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: { countryId: string }) => {
        this.getCountryCode(data.countryId);
      });
    if (this.address) {
      this.addressForm.patchValue({
        countryId: this.address.countryId,
        name: this.address.name,
        phone: this.address.phone,
        email: this.address.email,
        street: this.address.street,
        city: this.address.city,
        town: this.address.town,
        boxAddress: this.address.boxAddress,
        postalCode: this.address.postalCode,
        isDefault: this.address.isDefault ?? false, // Set isDefault value
      });
    }
  }

  getCountryCode(countryId: string) {
    if (this.currentCountryId !== countryId) {
      const country: Country | undefined = this.countries().find(
        (ct) => ct._id === countryId
      );
      this.currentCountryId = countryId;
      this.code = country ? country.mobileCode : '+254';
    } else {
      this.currentCountryId = countryId;
    }
  }

  submit() {
    try {
      if (this.addressForm.valid) {
        this.isLoading = true;
        const {
          countryId,
          name,
          phone,
          email,
          street,
          city,
          postalCode,
          town,
          boxAddress,
          isDefault,
        } = this.addressForm.value;
        // prepare the payload
        const payload: CreateAddress = {
          countryId,
          name,
          phone,
          email,
          street,
          city,
          postalCode,
          town,
          boxAddress,
          isDefault: isDefault ?? false,
        };
        if (this.address) {
          this.addressesService
            .update(payload, this.address._id.toString())
            .pipe()
            .subscribe({
              next: (res) => {
                const { data } = res;
                this.isLoading = false;
                this.notificationService.notify({
                  title: 'Success',
                  message: 'Address updated successfully',
                  status: NotificationStatusEnum.SUCCESS,
                });
                this.dilogRef.close(data);
              },
              error: (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.notificationService.notify({
                  title: 'Error',
                  message: error.error.message ?? 'Something went wrong',
                  status: NotificationStatusEnum.ERROR,
                });
              },
            });
        } else {
          // submit
          this.addressesService
            .create(payload)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                const { data } = res;
                this.isLoading = false;
                this.notificationService.notify({
                  title: 'Success',
                  message: 'The new address has been added successfully',
                  status: NotificationStatusEnum.SUCCESS,
                });
                this.dilogRef.close(data);
              },
            });
        }
      } else {
        this.isLoading = false;
        this.notificationService.notify({
          title: 'Warning',
          message: 'Please fill in all required fields',
          status: NotificationStatusEnum.SUCCESS,
        });
      }
    } catch (error) {
      this.isLoading = false;
    }
  }

  closeModal() {
    this.dilogRef.close();
  }
}
