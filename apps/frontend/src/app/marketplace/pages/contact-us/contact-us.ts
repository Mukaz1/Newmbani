import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Settings,
} from '@newmbani/types';
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { Button } from '../../../common/components/button/button';
import { NotificationService } from '../../../common/services/notification.service';
import { MetaService } from '../../../common/services/meta.service';
import { SettingsService } from '../../../settings/services/settings.service';

@Component({
  selector: 'app-contact-us',
  imports: [FormsModule, ReactiveFormsModule, Button],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.scss'],
})
export class ContactUs implements OnInit, OnDestroy {
  private readonly metaService = inject(MetaService);
  private readonly settingsService = inject(SettingsService);
  private readonly notificationService = inject(NotificationService);

  isLoading = signal(false);
  destroy$ = new Subject();
  settings = signal<Settings | null>(null);

  contactForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    purpose: new FormControl(''),

    // remember: [false, Validators.requiredTrue],
  });

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Contact Us',
            isClickable: false,
          },
        ],
      },
      title: 'Contact Us',
      description:
        'Get in touch with us for any questions, support, or partnership inquiries.',
    });
  }

  loadSettings() {
    this.isLoading.set(true);
    this.settingsService
      .getSettings()
      .pipe(take(1))
      .subscribe({
        next: (settings: HttpResponseInterface) => {
          this.settings.set(settings.data);
          this.isLoading.set(false);
        },
      });
  }

  ngOnInit(): void {
    this.contactForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Form data changed
      });
    this.loadSettings();
  }

  discard() {
    this.contactForm.reset();
  }

  submit() {
    this.isLoading.set(true);
    try {
      const { firstName, lastName, phone, email, message, purpose } =
        this.contactForm.value;

      const payload = {
        firstName,
        lastName,
        phone,
        email,
        message,
        purpose,
      };

      // this.createContactMessageService
      //   .createContactMessage(payload)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe({
      //     next: async (response: HttpResponseInterface) => {
      //       this.isLoading.set(false);

      //       const res: HttpResponseInterface = response;
      //       if (res?.statusCode === HttpStatusCodeEnum.CREATED) {
      //         this.notificationService.notify({
      //           title: 'Success!',
      //           message: res.message,
      //           status: NotificationStatusEnum.SUCCESS,
      //         });
      //         this.contactForm.reset();
      //       } else {
      //         this.notificationService.notify({
      //           title: 'Error!',
      //           message: res.message,
      //           status: NotificationStatusEnum.ERROR,
      //         });
      //       }
      //     },
      //     error: (error: HttpErrorResponse) => {
      //       console.log(error);
      //       this.isLoading.set(false);
      //       this.notificationService.notify({
      //         title: 'Error!',
      //         message: error.message,
      //         status: NotificationStatusEnum.ERROR,
      //       });
      //     },
      //   });
    } catch (error) {
      this.isLoading.set(false);

      this.notificationService.notify({
        title: 'Error!',
        message: 'An error occurred while creating the event',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  /**
   * On Destroy
   *
   * @memberof ManageEvent
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
