import { Component, inject, OnInit, signal, computed } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../services/onboarding.service';
import { CountriesService } from '../../../../countries/services/countries.service';
import { Button } from '../../../../common/components/button/button';
import { Country, NotificationStatusEnum } from '@newmbani/types';
import { ChipInput } from '../../../../common/components/chip-input/chip-input';
import { NotificationService } from '../../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordValidator } from '../../../../common/utils/passwordValidator.util';
import {
  SearchableSelect,
  SearchableSelectOption,
} from '../../../../marketplace/components/searchable-select/searchable-select';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register-landlord',
  standalone: true,
  imports: [ReactiveFormsModule, Button, ChipInput, SearchableSelect, NgClass],
  templateUrl: './register-landlord.html',
  styleUrls: ['./register-landlord.scss'],
})
export class RegisterLandlord implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingService);
  private countriesService = inject(CountriesService);
  private notificationService = inject(NotificationService);
  isLoading = signal(false);

  countries = signal<Country[]>([]);
  countryOptions = computed(() =>
    this.countries().map(
      (country): SearchableSelectOption => ({
        label: country.name,
        value: country._id,
        description: country.code,
      })
    )
  );

  landlordForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    // Address group (as in landlord CreateLandlord interface)
    address: this.fb.group({
      countryId: ['', Validators.required],
      county: ['', Validators.required],
      town: [''],
      street: [''],
      building: [''],
    }),
    acceptTerms: [false, Validators.requiredTrue],
    languages: [[]],
    idNumber: ['', [ Validators.minLength(8)]],
    password: ['', [Validators.required, passwordValidator()]],
    confirmPassword: ['', Validators.required],
  });

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  ngOnInit(): void {
    const allcountries = this.countriesService.allCountries;
    this.countries.set(allcountries());
  }

  onSubmit(): void {
    this.isLoading.set(true);
    if (this.landlordForm.invalid) {
      this.notificationService.notify({
        status: NotificationStatusEnum.WARNING,
        title: 'Missing or Invalid Fields',
        message: 'Please fill in the form Correctly',
      });
      this.isLoading.set(false);
      return;
    }

    // Check password match before submitting
    if (
      this.landlordForm.value.password !==
      this.landlordForm.value.confirmPassword
    ) {
      this.notificationService.notify({
        title: 'Warning',
        message: 'Passwords do not match.',
        status: NotificationStatusEnum.WARNING,
      });
      this.isLoading.set(false);
      return;
    }

    // Remove confirmPassword before submitting, ensure address is in correct format
    const { confirmPassword, ...payload } = this.landlordForm.value;

    this.onboardingService.registerLandlord(payload).subscribe({
      next: async (res) => {
        this.isLoading.set(false);
        this.notificationService.notify({
          message: 'Landlord account created successfully',
          status: NotificationStatusEnum.SUCCESS,
          title: 'Success',
        });
        this.router.navigate(['/auth/login/email']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.notificationService.notify({
          title: 'Error',
          message: err.error.message,
          status: NotificationStatusEnum.ERROR,
        });
      },
    });
  }

  get passwordIcon(): string {
    return this.showPassword() ? 'bi bi-eye-slash' : 'bi bi-eye';
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  patchLanguages(languages: string[]) {
    this.landlordForm.patchValue({
      languages,
    });
  }

  switchToLogin(): void {
    this.router.navigate(['/auth/login/email']);
  }
}
