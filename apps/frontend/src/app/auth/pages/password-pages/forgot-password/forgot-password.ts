import { NotificationStatusEnum } from '@newmbani/types';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { MetaService } from '../../../../common/services/meta.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { Button } from '../../../../common/components/button/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [Button, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationService);
  private router = inject(Router);
  private metaService = inject(MetaService);

  isLoading = signal(false);
  emailDoesNotExist = signal(false);
  success = signal(false);
  resetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  /**
   * Creates an instance of ForgotPassword.
   * @param {AuthService} authService
   * @param {NotificationService} notificationsService
   * @param {Router} router
   * @param {MetaService} metaService
   * @param {ChangeDetectorRef} changeDetectorRef
   * @memberof ForgotPassword
   */
  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Forgot Password',
            isClickable: false,
          },
        ],
      },
      title: 'Forgot Password',
      description: 'Forgot Password',
    });
  }

  resetPassword(): void {
    const { email } = this.resetForm.value;
    if (!email) return;
    this.isLoading.set(true);
    this.authService
      .resetPassword(email)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res && res.statusCode && res.statusCode == 200) {
            this.notificationsService.notify({
              title: 'Email Sent!',
              message: 'Password reset instructions sent to your email.',
              status: NotificationStatusEnum.SUCCESS,
            });
            this.success.set(true);
            // this.router.navigateByUrl('/auth');
          } else {
            this.isLoading.set(false);
            this.emailDoesNotExist.set(true);

            this.notificationsService.notify({
              title: 'User Not Found!',
              message: 'User with this email does not exist.',
              status: NotificationStatusEnum.ERROR,
            });
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.notificationsService.notify({
            title: 'Error!',
            message: 'Something went wrong. Please try again later.',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }
}
