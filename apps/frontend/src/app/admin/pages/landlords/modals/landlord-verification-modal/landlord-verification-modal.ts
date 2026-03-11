import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Button } from '../../../../../common/components/button/button';
import { Landlord, NotificationStatusEnum } from '@newmbani/types';
import { LandlordsService } from '../../../../../landlords/services/landlords.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-landlord-verification-modal',
  imports: [ReactiveFormsModule, NgClass, Button],
  templateUrl: './landlord-verification-modal.html',
  styleUrl: './landlord-verification-modal.scss',
})
export class LandlordVerificationModal implements OnInit {
  isLoading = signal<boolean>(false);
  landlord = signal<Landlord | null>(null);

  private dialogRef = inject(DialogRef);
  private data = inject(DIALOG_DATA) as { landlord: Landlord };
  private landlordsService = inject(LandlordsService);
  private notificationService = inject(NotificationService);

  landlordVerificationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    verificationStatus: new FormControl('', [Validators.required]),
    comments: new FormControl(''),
  });

  ngOnInit(): void {
    this.landlord.set(this.data.landlord);
    if (!this.landlord) return;
    this.landlordVerificationForm.patchValue({
      name: this.landlord()?.name,
      displayName: this.landlord()?.displayName,
      countryId: this.landlord()?.address.countryId,
    });
  }

  verifyLandlord() {
    this.isLoading.set(true);
    const landlordId = this.landlord()?._id;
    if (!landlordId) return;
    this.landlordsService.approveLandlord(landlordId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close({ verified: true, landlord: res.data });
        this.notificationService.notify({
          title: 'Verified',
          status: NotificationStatusEnum.SUCCESS,
          message: `Landlord ${this.landlord()?.displayName} verified successfully`,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.notificationService.notify({
          title: 'Errror',
          status: NotificationStatusEnum.ERROR,
          message: error.error.message,
        });
      },
    });
  }

  rejectLandlord() {
    // Set landlord.verified to false and close the modal with result
    this.isLoading.set(true);
    this.data.landlord.verified = false;
    this.isLoading.set(false);
    this.dialogRef.close({ verified: false, landlord: this.data.landlord });
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.landlordVerificationForm.valid) {
      const formData = this.landlordVerificationForm.value;
      if (formData.verificationStatus === 'approved') {
        this.verifyLandlord();
      } else if (formData.verificationStatus === 'rejected') {
        this.rejectLandlord();
      } else {
        this.closeModal();
      }
    } else {
      this.closeModal();
    }
  }
}
