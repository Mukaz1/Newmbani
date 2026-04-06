import {
  PropertyImage,
  NotificationStatusEnum,
  UpdatePropertyImage,
  PropertyImageCategory,
  HttpResponseInterface,
  PaginatedData,
} from '@newmbani/types';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs';
import { NotificationService } from '../../../common/services/notification.service';
import { PropertyImagesService } from '../../../admin/pages/image-categories/services/property-image.service';
import { Button } from '../../../common/components/button/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-change-image-category',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './change-image-category.html',
  styleUrl: './change-image-category.scss',
})
export class ChangeImageCategory implements OnInit {
  isLoading = signal(false);
  propertyImage = signal<PropertyImage | null>(null);
  propertyName = signal<string | null>(null);
  imageCategories = signal<PropertyImageCategory[]>([]);

  private data = inject(DIALOG_DATA) as {
    propertyImage: PropertyImage;
    propertyName: string;
  };
  private propertyImageService = inject(PropertyImagesService);
  private notificationService = inject(NotificationService);
  private propertyImageCategoriesService = inject(PropertyImagesService);
  private dialogRef = inject(DialogRef);
  private destroyRef = inject(DestroyRef);

  propertyImageForm = new FormGroup({
    propertyImageCategoryId: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.propertyName.set(this.data.propertyName);
    this.propertyImage.set(this.data.propertyImage);
    if (this.propertyImage()) {
      this.propertyImageForm.patchValue({
        propertyImageCategoryId:
          this.propertyImage()?.propertyImageCategoryId ?? '',
      });
    }
    this.fetchImageCategories();
  }

  fetchImageCategories() {
    this.isLoading.set(true);
    this.propertyImageCategoriesService
      .getPropertyImageCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const res = response as HttpResponseInterface<
            PaginatedData<PropertyImageCategory[]>
          >;
          this.imageCategories.set(res.data.data);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error!',
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  onSubmit() {
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

    const formValue = this.propertyImageForm.value;

    const payload: UpdatePropertyImage = {
      propertyImageCategoryId: formValue.propertyImageCategoryId ?? '',
    };
    this.propertyImageService
      .changePropertyImageCategory({
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
