import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationStatusEnum } from '@newmbani/types';
import { Button } from '../../../../common/components/button/button';
import { confirmPasswordValidator } from '../../../../common/helpers/password-match.helper';
import { MetaService } from '../../../../common/services/meta.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-update-password',
  imports: [FormsModule, ReactiveFormsModule, Button],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.scss'],
})
export class UpdatePassword implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationService);
  private router = inject(Router);
  private metaService = inject(MetaService);

  resetPasswordToken = signal<string | null>(null);
  isLoading = signal(false);
  password = signal<string | null | undefined>(undefined);
  userId = signal<string | null>(null);

  passwordResetForm: FormGroup = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        this.passwordValidator(),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        confirmPasswordValidator,
      ]),
    },
    { validators: [confirmPasswordValidator] }
  );

  /**
   * Creates an instance of UpdatePassword.
   * @memberof UpdatePassword
   */
  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Update Password',
            isClickable: false,
          },
        ],
      },
      title: 'Update Password',
      description: 'Update Password',
    });
  }

  ngOnInit(): void {
    this.resetPasswordToken.set(
      this.route.snapshot.paramMap.get('resetPasswordToken')
    );
    this.validateResetToken();
    this.passwordResetForm.valueChanges.subscribe((data: any) => {
      this.password.set(data.newPassword);
    });
  }

  validateResetToken() {
    const resetToken = this.resetPasswordToken();
    if (!resetToken) return;
    this.authService
      .validateResetToken(resetToken)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.userId.set(res.data.userId);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  // Custom validator function for password
  passwordValidator() {
    return (control: FormControl): { [key: string]: boolean } | null => {
      const value: string = control.value;

      // Check for at least 1 number
      const hasNumber = /[0-9]/.test(value);
      // Check for at least 1 special character
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(
        value
      );
      // Check for at least 1 lowercase letter
      const hasLowerCase = /[a-z]/.test(value);
      // Check for at least 1 uppercase letter
      const hasUpperCase = /[A-Z]/.test(value);
      // Check for minimum length of 8 characters
      const hasMinLength = value.length >= 8;

      // Combine all conditions
      const isValid =
        hasNumber &&
        hasSpecialCharacter &&
        hasLowerCase &&
        hasUpperCase &&
        hasMinLength;

      return isValid ? null : { invalidNewPassword: true };
    };
  }

  resetPassword() {
    const userId = this.userId();
    if (this.passwordResetForm.valid && this.resetPasswordToken && userId) {
      this.isLoading.set(true);
      const userDetails = {
        resetToken: this.resetPasswordToken() ?? '',
        newPassword: this.passwordResetForm.value.newPassword,
        userId,
      };
      this.authService
        .updatePassword(userDetails)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.router.navigateByUrl('auth/login');
            this.notificationsService.notify({
              title: 'Success!',
              message: 'Password update successful.',
              status: NotificationStatusEnum.SUCCESS,
            });
          },
          error: (error: HttpErrorResponse) => {
            this.notificationsService.notify({
              title: 'Error!',
              message: `Password update error.${error.error.message}`,
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    } else {
      // Handle invalid form
    }
  }

  resetForm() {
    this.passwordResetForm.reset();
  }
}
