import {
  HttpResponseInterface,
  Customer,
  NotificationStatusEnum,
  FileTypesEnum,
  UpdateCustomer,
  Country,
  User,
  Address,
} from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../auth/services/auth.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { CustomersService } from '../../../../services/customer.service';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { Dialog } from '@angular/cdk/dialog';
import { Button } from '../../../../../common/components/button/button';
import { Router } from '@angular/router';
import { SearchableSelectOption } from '../../../../../marketplace/components/searchable-select/searchable-select';
import { MediaService } from '../../../../../common/services/media.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, DataLoading, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private customersService = inject(CustomersService);
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationService);
  private dialog = inject(Dialog);
  private mediaService = inject(MediaService);
  private router = inject(Router);

  user = signal<User | undefined>(undefined);
  address = signal<Address | null>(null);
  customer = signal<Customer | undefined>(undefined);
  countries = signal<Country[]>([]);
  loading = signal(false);
  editMode = signal(false);
  selectedImageFile: File | null = null;

  countryOptions = computed(() =>
    this.countries().map(
      (country): SearchableSelectOption => ({
        label: country.name,
        value: country.name,
        description: country.code,
      })
    )
  );

  profileForm!: FormGroup;

  ngOnInit() {
    const user = this.authService.getStoredUser();
    this.user.set(user ?? undefined);
    if (user?.customerId) this.fetchCustomer(user.customerId);
  }

  fetchCustomer(id: string) {
    this.loading.set(true);
    this.customersService
      .getCustomerById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponseInterface<Customer>) => {
          this.loading.set(false);
          const customer = res.data;
          this.customer.set(customer);
          this.initializeForm(customer);
          this.profileForm.disable();
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationsService.notify({
            title: 'Error',
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  initializeForm(customer: Customer) {
    this.profileForm = this.fb.group({
      name: [customer.name || '', Validators.required],
      phone: [customer.phone || '', Validators.required],
    });
  }

  enableEdit() {
    this.editMode.set(true);
    this.profileForm.enable();
  }

  cancelEdit() {
    this.editMode.set(false);
    if (this.customer()) {
      this.initializeForm(this.customer()!);
      this.profileForm.disable();
    }
    this.selectedImageFile = null;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();

    // show preview before upload
    reader.onload = (e) => {
      if (this.user()) {
        this.user.update((s) => ({
          ...s!,
          profileImageUrl: e.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);

    // trigger upload separately
    this.onUploadCustomerProfile(file);
  }

  onUploadCustomerProfile(file: File) {
    if (!file || !this.customer()) return;

    this.loading.set(true);
    const formData: FormData = new FormData();

    // prepare form data
    formData.append('file', file, file.name);
    formData.set('type', FileTypesEnum.PROFILE_IMAGE);
    formData.set('reference', this.user()!._id);

    this.mediaService
      .uploadMedia(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: HttpResponseInterface) => {
          this.loading.set(false);

          // Update with the actual URL from the response
          const imageUrl =
            response.data?.secure_url ||
            response.data?.url ||
            response.data?.publicUrl;

          if (imageUrl) {
            this.user.update((s) => ({
              ...s!,
              profileImageUrl: imageUrl,
            }));
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          console.error(error);
          this.notificationsService.notify({
            title: 'Error!',
            message: error.error?.message || 'Failed to upload profile image.',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  updateProfile() {
    if (this.profileForm.invalid || !this.customer()) return;

    this.loading.set(true);
    const id = this.customer()!._id;
    const payload: UpdateCustomer = this.profileForm.value;

    this.customersService
      .updateCustomer(id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponseInterface<Customer>) => {
          this.loading.set(false);
          this.editMode.set(false);
          this.customer.set(res.data);
          this.profileForm.disable();
          this.notificationsService.notify({
            title: 'Success',
            message: 'Profile updated successfully',
            status: NotificationStatusEnum.SUCCESS,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationsService.notify({
            title: 'Error',
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  
}
