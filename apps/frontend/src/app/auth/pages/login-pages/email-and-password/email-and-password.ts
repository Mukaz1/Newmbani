import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MetaService } from '../../../../common/services/meta.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  NotificationStatusEnum,
  HttpResponseInterface,
  HttpStatusCodeEnum,
} from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from '../../../../common/components/button/button';

@Component({
  selector: 'app-email-and-password',
  imports: [FormsModule, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './email-and-password.html',
  styleUrl: './email-and-password.scss',
})
export class EmailAndPassword implements OnInit, OnDestroy {
  showPassword = false;
  rememberMe = false;

  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly metaService = inject(MetaService);
  private readonly route = inject(ActivatedRoute);

  hasError = false;
  isLoading = signal(false);
  destroy$ = new Subject();

  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  // 👇 store redirect target
  private redirectTo: string | null = null;
  private mode: string | null = null;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true),
  });

  async ngOnInit(): Promise<void> {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Login',
            isClickable: false,
          },
        ],
      },
      title: 'Login',
      description: 'Login with Email and Password',
    });

    const token = this.authService.getAccessToken();
    if (token) {
      this.router.navigateByUrl('/portal-index');
    }

    // 👇 capture query params for redirect after login
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.redirectTo = params['redirectTo'] || null;
        this.mode = params['mode'] || null;
      });

    this.isLoading.set(false);
  }

  submit(): void {
    this.isLoading.set(true);

    if (this.loginForm.invalid) {
      this.notificationService.notify({
        title: 'Login Error!',
        message: 'The Login form is invalid. Try again!',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    const { email, password } = this.loginForm.value;
    const payload: { email: string; password: string } = { email, password };

    this.authService
      .login(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (response: HttpResponseInterface) => {
          if (response.statusCode == HttpStatusCodeEnum.UNAUTHORIZED) {
            this.notificationService.notify({
              title: 'Error!',
              message: response.message,
              status: NotificationStatusEnum.ERROR,
            });
            return;
          }

          if (
            !response.data ||
            !response.data.access_token ||
            !response.data.refresh_token ||
            response.statusCode == 400
          ) {
            this.notificationService.notify({
              title: 'Login Failed!',
              message: 'Kindly review your credentials and try again!',
              status: NotificationStatusEnum.ERROR,
            });
            this.isLoading.set(false);
            this.hasError = true;
            return;
          }

          // ✅ Persist the tokens
          this.authService.persistTokens(response);

          const userType = response.data.user.type;
          if (userType) {
            localStorage.setItem('user_type', userType);
          }

          this.notificationService.notify({
            title: 'Login Success!',
            message: response.message,
            status: NotificationStatusEnum.SUCCESS,
          });

          this.isLoading.set(false);

          // ✅ Use redirectTo if available, else fallback
          if (this.redirectTo) {
            this.router.navigate([this.redirectTo], {
              queryParams: this.mode ? { mode: this.mode } : {},
            });
          } else {
            this.router.navigate(['/portal-index']);
          }

          if (this.isBrowser) {
            localStorage.removeItem('gms_current_url');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Login Error!',
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  switchToSignup() {
    this.router.navigate(['auth/register/customer']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
