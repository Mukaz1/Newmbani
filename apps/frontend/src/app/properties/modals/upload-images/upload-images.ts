import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FileMimeGroups,
  FileTypesEnum,
  HttpResponseInterface,
  NotificationStatusEnum,
  PropertyImageCategory,
} from '@newmbani/types';
import { take } from 'rxjs';
import { NotificationService } from '../../../common/services/notification.service';
import { FileUploader } from '../../../common/components/file-uploader/file-uploader';
import { Button } from '../../../common/components/button/button';
import { PropertyImagesService } from '../../../admin/pages/image-categories/services/property-image.service';

@Component({
  selector: 'app-upload-images',
  imports: [FileUploader, Button],
  templateUrl: './upload-images.html',
  styleUrl: './upload-images.scss',
})
export class UploadImages implements OnInit {
  data = inject<{ propertyId: string; propertyImageCategoryId: string }>(
    DIALOG_DATA,
  );
  private readonly dialogRef = inject(DialogRef);
  selectedFiles: File[] = [];
  fileMimeGroups = FileMimeGroups;
  isLoading = signal<boolean>(false);
  currentYear = new Date().getFullYear();
  imageCategory = signal<PropertyImageCategory | null>(null);
  private readonly propertyImageCategoriesService = inject(
    PropertyImagesService,
  );
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    const categoryId = this.data.propertyImageCategoryId;
    if (!categoryId) {
      return;
    }
    this.getImageCategory(categoryId);
  }

  getImageCategory(categoryId: string) {
    this.isLoading.set(true);
    this.propertyImageCategoriesService
      .getPropertyImageCategoryById(categoryId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.imageCategory.set(res.data);
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

  onFilesSelected(files: File[]) {
    this.selectedFiles = files;
  }

  upload() {
    const propertyId: string = this.data.propertyId;
    const propertyImageCategoryId = this.data.propertyImageCategoryId;
    const formData: FormData = new FormData();

    // Prepare the form data for upload to EXACTLY match the screenshot
    // POST body should have:
    // files: (1 or many, as files[])
    // propertyImageCategoryId: string
    // propertyId: string
    // type: string ("property-image")
    formData.set('propertyId', propertyId);
    formData.set('propertyImageCategoryId', propertyImageCategoryId);

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file: File = this.selectedFiles[i];
      formData.append('files', file, file.name);
    }

    this.isLoading.set(true);

    const upload$ =
      this.propertyImageCategoriesService.uploadPropertyImages(formData);

    upload$.pipe(take(1)).subscribe({
      next: (response: HttpResponseInterface) => {
        this.isLoading.set(false);
        this.notificationService.notify({
          title: 'SUCCESS!',
          message: response.message,
          status: NotificationStatusEnum.SUCCESS,
        });
        this.selectedFiles = [];
        this.navigate();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.isLoading.set(false);
        this.notificationService.notify({
          title: 'Error!',
          message: error.error.message,
          status: NotificationStatusEnum.ERROR,
        });
      },
    });
  }

  navigate() {
    this.closeModal(this.data.propertyId);
  }

  closeModal(propertyId?: string) {
    this.dialogRef.close(propertyId);
  }
}
