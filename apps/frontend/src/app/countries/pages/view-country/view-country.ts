import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Country, NotificationStatusEnum, UpdateCountry } from '@newmbani/types';
import { NotificationService } from '../../../common/services/notification.service';
import { MetaService } from '../../../common/services/meta.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CountriesService } from '../../services/countries.service';
import { NgClass } from '@angular/common';

interface EditableFields {
  taxRate: boolean;
  serviceRate: boolean;
  propertyRate: boolean;
}

@Component({
  selector: 'app-view-country',
  imports: [FormsModule, NgClass],
  templateUrl: './view-country.html',
  styleUrl: './view-country.scss',
})
export class ViewCountry implements OnInit {
  country = signal<Country | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  data = inject<Country>(DIALOG_DATA);

  // Edit mode signals
  editableFields = signal<EditableFields>({
    taxRate: false,
    serviceRate: false,
    propertyRate: false,
  });

  // Temporary values for editing
  tempTaxRate = signal<number>(0);
  tempServiceRate = signal<number>(0);
  tempPropertyRate = signal<number>(0);

  // Loading states for updates
  isUpdatingSupport = signal(false);
  isUpdatingTaxRate = signal(false);
  isUpdatingService = signal(false);
  isUpdatingProperty = signal(false);

  currentYear = new Date().getFullYear();

  private readonly router = inject(Router);
  private readonly countriesService = inject(CountriesService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(DialogRef);
  private metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Country Details',
            isClickable: false,
          },
        ],
      },
      title: 'Country Details',
      description: 'Country Details',
    });
  }

  ngOnInit(): void {
    this.country.set(this.data);
  }

  async fetchCountryDetails() {
    if (!this.country()) return;

    const country: Country | undefined =
      await this.countriesService.getCountryById(
        this.country()!._id.toString()
      );
    if (!country) return;
    this.country.set(country);
    // Initialize temp values
    this.tempTaxRate.set(country.taxRate);
    this.tempServiceRate.set(country.commissionRates.service.rate);
    this.tempPropertyRate.set(country.commissionRates.property.rate);
  }

  // Toggle support status
  toggleOverallSupport(supported: boolean) {
    if (this.isUpdatingSupport()) return;
    const data: {
      customer: boolean;
      host: boolean;
    } = {
      host: supported,
      customer: supported,
    };
    this.updateCountryField(
      { supporting: data },
      () => {
        this.isUpdatingSupport.set(true);
      },
      () => {
        this.isUpdatingSupport.set(false);
      }
    );
  }

  toggleHostSupport(hostSupport: boolean) {
    if (this.isUpdatingSupport()) return;

    this.updateCountryField(
      {
        supporting: {
          host: hostSupport,
          customer: this.country()!.supporting.customer,
        },
      },
      () => {
        this.isUpdatingSupport.set(true);
      },
      () => {
        this.isUpdatingSupport.set(false);
      }
    );
  }

  toggleCustomerSupport(customerSupport: boolean) {
    if (this.isUpdatingSupport()) return;

    this.updateCountryField(
      {
        supporting: {
          host: this.country()!.supporting.host,
          customer: customerSupport,
        },
      },
      () => {
        this.isUpdatingSupport.set(true);
      },
      () => {
        this.isUpdatingSupport.set(false);
      }
    );
  }

  // Edit mode toggles
  enableTaxRateEdit() {
    this.editableFields.update((fields) => ({ ...fields, taxRate: true }));
  }

  enableServiceEdit() {
    this.editableFields.update((fields) => ({
      ...fields,
      serviceRate: true,
    }));
  }

  enablePropertyEdit() {
    this.editableFields.update((fields) => ({ ...fields, propertyRate: true }));
  }

  // Save methods
  saveTaxRate() {
    if (this.isUpdatingTaxRate()) return;

    this.updateCountryField(
      { taxRate: this.tempTaxRate() },
      () => {
        this.isUpdatingTaxRate.set(true);
      },
      () => {
        this.isUpdatingTaxRate.set(false);
        this.editableFields.update((fields) => ({ ...fields, taxRate: false }));
      }
    );
  }

  saveServiceRate() {
    if (this.isUpdatingService()) return;

    const currentCountry = this.country()!;
    this.updateCountryField(
      {
        commissionRates: {
          service: {
            rate: this.tempServiceRate(),
            isPercentage: currentCountry.commissionRates.service.isPercentage,
          },
        },
      },
      () => {
        this.isUpdatingService.set(true);
      },
      () => {
        this.isUpdatingService.set(false);
        this.editableFields.update((fields) => ({
          ...fields,
          serviceRate: false,
        }));
      }
    );
  }

  savePropertyRate() {
    if (this.isUpdatingProperty()) return;

    const currentCountry = this.country()!;
    this.updateCountryField(
      {
        commissionRates: {
          property: {
            rate: this.tempPropertyRate(),
            isPercentage: currentCountry.commissionRates.property.isPercentage,
          },
        },
      },
      () => {
        this.isUpdatingProperty.set(true);
      },
      () => {
        this.isUpdatingProperty.set(false);
        this.editableFields.update((fields) => ({
          ...fields,
          propertyRate: false,
        }));
      }
    );
  }

  // Cancel edit methods
  cancelTaxRateEdit() {
    this.tempTaxRate.set(this.country()!.taxRate);
    this.editableFields.update((fields) => ({ ...fields, taxRate: false }));
  }

  cancelServiceEdit() {
    this.tempServiceRate.set(this.country()!.commissionRates.service.rate);
    this.editableFields.update((fields) => ({
      ...fields,
      serviceRate: false,
    }));
  }

  cancelPropertyEdit() {
    this.tempPropertyRate.set(this.country()!.commissionRates.property.rate);
    this.editableFields.update((fields) => ({
      ...fields,
      propertyRate: false,
    }));
  }

  // Generic update method
  private updateCountryField(
    updateData: UpdateCountry,
    onStart: () => void,
    onComplete: () => void
  ) {
    const id = this.country()?._id;
    if (!id) return;

    onStart();

    this.countriesService
      .updateCountry(id, updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.country.set(response.data);
            this.notificationService.notify({
              title: 'Success',
              status: NotificationStatusEnum.SUCCESS,
              message: 'Country updated successfully',
            });
          }
          onComplete();
        },
        error: (error) => {
          const errorMessage =
            error.error?.message || error.message || 'Failed to update country';

          this.notificationService.notify({
            title: 'Error',
            status: NotificationStatusEnum.ERROR,
            message: errorMessage,
          });
          onComplete();
        },
      });
  }

  goBack() {
    this.router.navigate(['/admin/countries']);
  }

  getSupportStatusClass(supported: boolean): string {
    return supported
      ? 'bg-green-100 text-green-700 border border-green-200'
      : 'bg-red-100 text-red-700 border border-red-200';
  }

  getSupportStatusText(supported: boolean): string {
    return supported ? 'Supported' : 'Not Supported';
  }

  getHostSupportClass(hostSupport: boolean): string {
    return hostSupport
      ? 'bg-blue-100 text-blue-700 border border-blue-200'
      : 'bg-gray-100 text-gray-700 border border-gray-200';
  }

  getCustomerSupportClass(customerSupport: boolean): string {
    return customerSupport
      ? 'bg-purple-100 text-purple-700 border border-purple-200'
      : 'bg-gray-100 text-gray-700 border border-gray-200';
  }

  closeModal() {
    this.dialogRef.close();
  }

  formatDate(dateString: string): Date {
    return new Date(dateString);
  }
}
