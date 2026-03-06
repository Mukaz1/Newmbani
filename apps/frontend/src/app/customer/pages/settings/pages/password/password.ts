import { User, NotificationStatusEnum } from '@newmbani/types';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../../../auth/services/auth.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password',
  imports: [ReactiveFormsModule, DataLoading],
  templateUrl: './password.html',
  styleUrl: './password.scss',
})
export class Password implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationService);

  user = signal<User | undefined>(undefined);
  loading = signal(false);
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });

  ngOnInit() {
    const user = this.authService.getStoredUser();
    this.user.set(user ?? undefined);
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.notificationsService.notify({
        title: 'Error',
        message: 'Please fill in all required fields correctly',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    const { confirmPassword, currentPassword, newPassword } =
      this.passwordForm.value;

    // Validate matching passwords
    if (newPassword !== confirmPassword) {
      this.notificationsService.notify({
        title: 'Error',
        message: 'New password and confirm password do not match',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    this.loading.set(true);

    const payload = {
      newPassword: newPassword ?? '',
      currentPassword: currentPassword ?? '',
    };

    this.authService
      .updatePasswordWhenLoggedIn(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loading.set(false);
          this.notificationsService.notify({
            title: 'Success',
            message: res.message || 'Password updated successfully',
            status: NotificationStatusEnum.SUCCESS,
          });
          this.passwordForm.reset();

          // Optionally log the user out to require re-authentication
          // this.authService.logout(false, true);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationsService.notify({
            title: 'Error',
            message: error?.error?.message || 'Failed to update password',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  resetForm() {
    this.passwordForm.reset();
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
}
