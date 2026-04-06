import {
  NotificationStatusEnum,
  PropertyImage,
  PropertyImageApprovalStatus,
  PropertyImageReviewInterface,
} from '@newmbani/types';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PropertyImagesService } from '../../../admin/pages/image-categories/services/property-image.service';
import { NotificationService } from '../../../common/services/notification.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from '../../../common/components/button/button';

@Component({
  selector: 'app-property-image-review-modal',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './property-image-review-modal.html',
  styleUrl: './property-image-review-modal.scss',
})
export class PropertyImageReviewModal implements OnInit {
  isLoading = signal(false);
  propertyImage = signal<PropertyImage | null>(null);
  propertyName = signal<string | null>(null);

  private data = inject(DIALOG_DATA) as {
    propertyImage: PropertyImage;
    propertyName: string;
  };
  private propertyImageService = inject(PropertyImagesService);
  private notificationService = inject(NotificationService);
  private dialogRef = inject(DialogRef);

  imageReviewForm = new FormGroup({
    status: new FormControl(
      PropertyImageApprovalStatus.PENDING_REVIEW,
      Validators.required,
    ),
    comment: new FormControl(''),
  });

  PropertyImageApprovalStatus = PropertyImageApprovalStatus;

  ngOnInit(): void {
    this.propertyName.set(this.data.propertyName);
    this.propertyImage.set(this.data.propertyImage);
    if (this.propertyImage()) {
      this.imageReviewForm.patchValue({
        status:
          this.propertyImage()?.approvalStatus ??
          PropertyImageApprovalStatus.PENDING_REVIEW,
      });
    }
  }
  onSubmit() {
    if (this.imageReviewForm.invalid) {
      this.imageReviewForm.markAllAsTouched();
      this.notificationService.notify({
        title: 'Error',
        message: 'Please select a status to proceed.',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    this.isLoading.set(true);

    const propertyImageId = this.propertyImage()?._id;
    if (!propertyImageId) {
      this.notificationService.notify({
        title: 'Error',
        message: 'Image not Found',
        status: NotificationStatusEnum.ERROR,
      });
      this.isLoading.set(false);
      return;
    }

    const formValue = this.imageReviewForm.value;

    const payload: PropertyImageReviewInterface = {
      status: formValue.status ?? PropertyImageApprovalStatus.PENDING_REVIEW,
      comment: formValue.comment ?? '',
    };
    this.propertyImageService
      .reviewProperty({
        propertyImageId,
        payload,
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.propertyImage.set(res.data);
          this.dialogRef.close(res.data);
          this.notificationService.notify({
            status: NotificationStatusEnum.SUCCESS,
            message: res.message,
            title: 'Success',
          });
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.notify({
            status: NotificationStatusEnum.ERROR,
            title: 'Error',
            message: err.error.message,
          });
          this.isLoading.set(false);
          this.closeModal();
        },
      });
  }
  closeModal() {
    this.dialogRef.close();
  }
}
