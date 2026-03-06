import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  Property,
  Landlord,
  Address,
  NotificationStatusEnum,
  HttpResponseInterface,
  FileTypesEnum,
} from '@newmbani/types';
import { AuthService } from '../../../../auth/services/auth.service';
import { AddressesService } from '../../../../addresses/services/addresses.service';
import { take } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewImageModal } from '../../../../common/components/view-image-modal/view-image-modal';
import { Button } from '../../../../common/components/button/button';
import { ChipInput } from '../../../../common/components/chip-input/chip-input';
import { DataLoading } from '../../../../common/components/data-loading/data-loading';
import { NotificationService } from '../../../../common/services/notification.service';
import { ManageAddress } from '../../../../customer/components/addresses/modals/manage-address/manage-address';
import { MediaService } from '../../../../files/services/media.service';
import { LandlordsService } from '../../../services/landlords.service';

@Component({
  selector: 'app-landlord-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    DataLoading,
    ChipInput,
    Button,
    ViewImageModal,
  ],
  templateUrl: './landlord-profile.html',
  styleUrl: './landlord-profile.scss',
})
export class LandlordProfile implements OnInit {
  /** ------------------- SIGNALS & STATES ------------------- */
  landlord = signal<Landlord | null>(null);
  addresses = signal<Address[]>([]);
  landlordProperties: Property[] = [];
  isLoading = signal<boolean>(true);
  isEditProfile = signal(true);
  showModal = signal(false);

  profileForm = new FormGroup({
    displayName: new FormControl<string>(''),
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    phone: new FormControl<string>(''),
    idNumber: new FormControl<string>(''),
    addressId: new FormControl<string>(''),
    countryId: new FormControl<string>(''),
    languages: new FormControl<string[]>([]),
    bio: new FormControl<string>(''),
  });

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private addressesService = inject(AddressesService);
  private notificationsService = inject(NotificationService);
  private mediaService = inject(MediaService);
  private landlordsService = inject(LandlordsService);
  private dialog = inject(Dialog);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentUser = this.authService.user;
  landlordId = this.currentUser()?.landlordId;

  /** ------------------- LIFECYCLE ------------------- */
  ngOnInit() {
    if (!this.landlordId) {
      console.warn('No landlord ID found for current user');
      this.isLoading.set(false);
      return;
    }

    this.fetchLandlord();
    this.fetchAddresses();
  }

  fetchLandlord() {
    this.isLoading.set(true);
    this.isEditProfile.set(false);

    this.landlordsService
      .getLandlordProfileById(this.landlordId!)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          const landlord = res.data as Landlord;
          this.landlord.set(landlord);
          this.profileForm.patchValue({
            name: landlord.name ?? '',
            displayName: landlord.name ?? '',
            email: landlord.email ?? '',
            phone: landlord.phone ?? '',
            idNumber: landlord.idNumber ?? '',
            addressId: landlord.addressId ?? '',
            languages: landlord.languages ?? [],
            bio: landlord.bio ?? '',
          });

          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to fetch landlord profile:', error);
          this.isLoading.set(false);
        },
      });
  }

  fetchAddresses() {
    this.isEditProfile.set(false);

    this.addressesService
      .all()
      .pipe(take(1))
      .subscribe({
        next: (res) => this.addresses.set(res.data.data),
        error: (error) => console.error('Failed to fetch addresses:', error),
      });
  }

  enterEditProfile() {
    this.isEditProfile.set(true);
  }

  cancelEditProfile() {
    this.isEditProfile.set(false);
    if (this.landlord()) this.profileForm.patchValue(this.landlord() ?? {});
  }

  saveEditProfile() {
    if (this.profileForm.valid && this.landlord()) {
      const currentLandlord = this.landlord();
      if (!currentLandlord) {
        this.isLoading.set(false);
        this.notificationService.notify({
          title: 'Error',
          message: 'Landlord data is missing. Cannot update profile.',
          status: NotificationStatusEnum.ERROR,
        });
        return;
      }

      const formValue = this.profileForm.value;

      const updatedLandlord: Partial<Landlord> = {
        name: formValue.name ?? currentLandlord.name ?? '',
        email: formValue.email ?? currentLandlord.email ?? '',
        phone: formValue.phone ?? currentLandlord.phone ?? '',
        bio: formValue.bio ?? currentLandlord.bio ?? '',
        languages: formValue.languages ?? currentLandlord.languages ?? [],
        addressId: formValue.addressId ?? currentLandlord.addressId ?? '',
        idNumber: formValue.idNumber ?? currentLandlord.idNumber ?? '',
      };

      this.isLoading.set(true);

      this.landlordsService
        .updateLandlordProfileById(currentLandlord._id, updatedLandlord)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const updatedData = response?.data;
            if (updatedData) {
              this.landlord.set(updatedData);
              this.notificationService.notify({
                title: 'Profile Updated',
                message: 'Your profile has been successfully updated.',
                status: NotificationStatusEnum.SUCCESS,
              });
            } else {
              this.notificationService.notify({
                title: 'Update Failed',
                message: 'No updated data returned from server.',
                status: NotificationStatusEnum.ERROR,
              });
            }
          },
          error: (err) => {
            console.error('Profile update error:', err);
            this.notificationService.notify({
              title: 'Error',
              message: 'Something went wrong while updating your profile.',
              status: NotificationStatusEnum.ERROR,
            });
          },
          complete: () => {
            this.isEditProfile.set(false);
            this.isLoading.set(false);
          },
        });
    } else {
      this.notificationService.notify({
        title: 'Invalid Input',
        message: 'Please complete all required fields before saving.',
        status: NotificationStatusEnum.WARNING,
      });
    }
  }

  /** ------------------- ADDRESS MANAGEMENT ------------------- */
  manageAddresses() {
    this.router.navigate(['/landlord/addresses']);
  }
  openManageAddress() {
    const dialogRef = this.dialog.open(ManageAddress, {
      data: { address: this.landlord()?.address },
    });

    dialogRef.closed.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.landlord.update((prev) =>
          prev
            ? {
                ...prev,
                address: { ...prev.address, ...result },
                addressId: (result as any)._id ?? prev.addressId,
                countryId: (result as any).countryId ?? prev.countryId,
              }
            : prev
        );
      }
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();

    // show preview before upload
    reader.onload = (e) => {
      if (this.landlord()) {
        this.landlord.update((s) => ({
          ...s!,
          profileImageUrl: e.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);

    // trigger upload separately
    this.uploadProfileImage(file);
  }
  // In your landlord-profile.component.ts
  uploadProfileImage(file: File) {
    if (!file || !this.landlord()) return;

    this.isLoading.set(true);
    const formData: FormData = new FormData();

    formData.append('file', file, file.name);
    formData.set('type', FileTypesEnum.LANDLORD_LOGO);
    formData.set('reference', this.landlord()!._id);

    this.mediaService
      .uploadMedia(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: HttpResponseInterface) => {
          this.isLoading.set(false);

          // Just refetch the landlord profile - the image is already saved!
          this.fetchLandlord();

          this.notificationsService.notify({
            title: 'Success!',
            message: 'Profile image uploaded successfully.',
            status: NotificationStatusEnum.SUCCESS,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationsService.notify({
            title: 'Error!',
            message: error.error?.message || 'Failed to upload profile image.',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  viewImage() {
    this.showModal.set(true);
  }
}
