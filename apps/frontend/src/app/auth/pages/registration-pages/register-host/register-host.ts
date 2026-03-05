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
  selector: 'app-register-host',
  standalone: true,
  imports: [ReactiveFormsModule, Button, ChipInput, SearchableSelect, NgClass],
  templateUrl: './register-host.html',
  styleUrls: ['./register-host.scss'],
})
export class RegisterHost implements OnInit {
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
  hostForm: FormGroup = this.fb.group({
    displayName: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    countryId: ['', Validators.required],
    idNumber: [null, Validators.required, Validators.minLength(8)],
    password: ['', [Validators.required, passwordValidator()]],
    confirmPassword: ['', Validators.required],
    languages: [[], Validators.required],
    acceptTerms: [false, Validators.requiredTrue],
  });
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  ngOnInit(): void {
    const allcountries = this.countriesService.allCountries;
    this.countries.set(allcountries());
  }
  onSubmit(): void {
    this.isLoading.set(true);
    if (this.hostForm.invalid) {
      this.notificationService.notify({
        status: NotificationStatusEnum.WARNING,
        title: 'Missing or Invalid Fields',
        message: 'Please fill in the form Correctly',
      });
    }

    // Remove confirmPassword before submitting
    if (this.hostForm.value.password !== this.hostForm.value.confirmPassword) {
      this.notificationService.notify({
        title: 'Warning',
        message: 'Passwords do not match.',
        status: NotificationStatusEnum.WARNING,
      });
      return;
    }
    const { confirmPassword, ...payload } = this.hostForm.value;

    this.onboardingService.registerHost(payload).subscribe({
      next: async (res) => {
        this.isLoading.set(false);
        this.notificationService.notify({
          message: 'Host Account created Successfully',
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
    this.hostForm.patchValue({
      languages,
    });
  }

  switchToLogin(): void {
    this.router.navigate(['/auth/login/email']);
  }
}
