import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import {
  GeneralSettings,
  HttpResponseInterface,
  NotificationStatusEnum,
  Settings,
} from '@newmbani/types';
import { Subject, take, takeUntil } from 'rxjs';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import { LogoUploadModal } from '../../components/logo-upload-modal/logo-upload-modal';
import { SettingsService } from '../../services/settings.service';
import { DataLoading } from '../../../common/components/data-loading/data-loading';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'],
  imports: [FormsModule, ReactiveFormsModule, DataLoading],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly metaService = inject(MetaService);
  private readonly settingsService = inject(SettingsService);
  private readonly notificationsService = inject(NotificationService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

  settings = signal<Settings | null>(null);
  isLoading = signal(false);
  logoUrl = computed(() => this.settings()?.branding.logo);

  url: SafeUrl | ArrayBuffer = '';
  blobURL: string | ArrayBuffer = '';
  file: File | null = null;
  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial';
  destroy$ = new Subject();
  showLogoModal = false;

  generalSettingsForm = new FormGroup({
    company: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    address: new FormGroup({
      boxAddress: new FormControl('', [Validators.required]),
      town: new FormControl('', [Validators.required]),
      building: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    }),
    KRA: new FormControl('', [Validators.required]),
    app: new FormControl('', [Validators.required]),
  });

  get addressFormGroup(): FormGroup {
    return this.generalSettingsForm.get('address') as FormGroup;
  }

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Settings',
            isClickable: false,
          },
        ],
      },
      title: 'Settings',
      description: 'Settings',
    });
  }

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.isLoading.set(true);
    this.settingsService
      .getSettings()
      .pipe(take(1))
      .subscribe({
        next: (settings: HttpResponseInterface) => {
          this.settings.set(settings.data);
          this.patchForm();
          this.isLoading.set(false);
        },
      });
  }

  patchForm() {
    const settings = this.settings();
    if (!settings) return;

    this.generalSettingsForm.patchValue({
      company: settings.general.company,
      email: settings.general.email,
      phone: settings.general.phone,
      address: {
        boxAddress: settings.general.address.boxAddress,
        town: settings.general.address.town,
        building: settings.general.address.building,
        street: settings.general.address.street,
        postalCode: settings.general.address.postalCode,
        country: settings.general.address.country,
      },
      KRA: settings.general.KRA,
      app: settings.general.app,
    });
  }

  onChange(event: Event) {
    const selectedFile = (event.target as HTMLInputElement).files?.[0];
    if (selectedFile) {
      this.status = 'initial';
      this.file = selectedFile;
    }
  }

  onSubmit() {
    const settings = this.settings();
    if (this.generalSettingsForm.valid && settings) {
      this.isLoading.set(true);

      const generalValue = this.generalSettingsForm.value as GeneralSettings;

      const payload: GeneralSettings = {
        company: generalValue.company || settings.general.company,
        email: generalValue.email || settings.general.email,
        phone: generalValue.phone || settings.general.phone,
        address: {
          boxAddress:
            generalValue.address.boxAddress ||
            settings.general.address.boxAddress,
          town: generalValue.address.town || settings.general.address.town,
          building:
            generalValue.address.building || settings.general.address.building,
          street:
            generalValue.address.street || settings.general.address.street,
          postalCode:
            generalValue.address.postalCode ||
            settings.general.address.postalCode,
          country:
            generalValue.address.country || settings.general.address.country,
        },
        KRA: generalValue.KRA || settings.general.KRA,
        app: generalValue.app || settings.general.app,
      };

      this.settingsService
        .updateGeneralSettings(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: HttpResponseInterface) => {
            this.isLoading.set(false);

            this.notificationsService.notify({
              title: 'SUCCESS!',
              message: response.message
                ? response.message
                : 'Your changes have been effected. ',
              status: NotificationStatusEnum.SUCCESS,
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error updating settings:', error);
            this.isLoading.set(false);
            this.notificationsService.notify({
              title: 'Error!',
              message: error.message,
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    } else {
      this.notificationsService.notify({
        title: 'Missing Fields',
        message: 'Please fill in all required fields',
        status: NotificationStatusEnum.WARNING,
      });
    }
  }

  openLogoModal() {
    const modalRef = this.dialog.open(LogoUploadModal, {
      disableClose: true,
    });
    modalRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.getSettings();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
