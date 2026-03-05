import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../services/onboarding.service';
import { CountriesService } from '../../../../countries/services/countries.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { NotificationStatusEnum } from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from '../../../../common/components/button/button';
import { passwordValidator } from '../../../../common/utils/passwordValidator.util';
import {
  SearchableSelect,
  SearchableSelectOption,
} from '../../../../marketplace/components/searchable-select/searchable-select';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register-email-password',
  imports: [ReactiveFormsModule, Button, SearchableSelect, NgClass],
  templateUrl: './register-email-password.html',
  styleUrl: './register-email-password.scss',
})
export class RegisterEmailPassword implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingService);
  private countriesService = inject(CountriesService);
  private notificationService = inject(NotificationService);
  isLoading = signal(false);
  countries = this.countriesService.allCountries;
  countryOptions = computed(() =>
    this.countries().map(
      (country): SearchableSelectOption => ({
        label: country.name,
        value: country._id,
        description: country.code,
      })
    )
  );
  customerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    countryId: ['', Validators.required],
    password: ['', [Validators.required, passwordValidator()]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  });

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  get passwordIcon(): string {
    return this.showPassword() ? 'bi bi-eye-slash' : 'bi bi-eye';
  }

  ngOnInit(): void {
    this.countriesService.fetchAllCountries();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  onSignup(): void {
    this.isLoading.set(true);
    if (this.customerForm.invalid) return;

    const { confirmPassword, ...payload } = this.customerForm.value;
    this.onboardingService.registerCustomer(payload).subscribe({
      next: () => (
        this.notificationService.notify({
          message: 'Account Registered Successfully',
          status: NotificationStatusEnum.SUCCESS,
          title: 'Success',
        }),
        this.isLoading.set(false),
        this.router.navigate(['/auth/login'])
      ),
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.notificationService.notify({
          message: err.error.message,
          title: 'Error',
          status: NotificationStatusEnum.ERROR,
        });
      },
    });
  }

  switchToLogin(): void {
    this.router.navigate(['/auth/login/email']);
  }
}
