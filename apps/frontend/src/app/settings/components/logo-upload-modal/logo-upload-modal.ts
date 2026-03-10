import { DialogRef } from '@angular/cdk/dialog';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  FileTypesEnum,
  HttpResponseInterface,
  NotificationStatusEnum,
} from '@newmbani/types';
import { NotificationService } from '../../../common/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { MediaService } from '../../../common/services/media.service';

@Component({
  selector: 'app-logo-upload-modal',
  templateUrl: './logo-upload-modal.html',
  styleUrls: ['./logo-upload-modal.scss'],
})
export class LogoUploadModal {
  private readonly dialogRef = inject(DialogRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationsService = inject(NotificationService);
  private readonly mediaService = inject(MediaService);

  selectedFile = signal<File | null>(null);
  blobUrl = computed(() => {
    const file = this.selectedFile();
    if (!file) {
      return null;
    }
    return URL.createObjectURL(file);
  });

  isUploading = signal(false);
  uniqueId = Math.random().toString(36).substring(7);

  closeModal() {
    this.dialogRef.close();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.validateAndSetFile(files[0]);
    }
  }

  validateAndSetFile(file: File) {
    // Check file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Please upload a PNG, JPG, or JPEG file.');
      return;
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB.');
      return;
    }

    this.selectedFile.set(file);
  }

  onUploadCompanyLogo(file: File) {
    this.isUploading.set(true);
    const formData: FormData = new FormData();

    // prepare the form data for upload
    formData.append('file', file, file.name);
    formData.set('type', FileTypesEnum.COMPANY_LOGO);
    formData.set('reference', 'company-logo');

    this.mediaService
      .uploadMedia(formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: HttpResponseInterface) => {
          this.isUploading.set(false);
          this.notificationsService.notify({
            title: 'SUCCESS!',
            message: response.message,
            status: NotificationStatusEnum.SUCCESS,
          });
          this.closeModal();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.isUploading.set(false);
          this.notificationsService.notify({
            title: 'Error!',
            message: error.message,
            status: NotificationStatusEnum.ERROR,
          });
          this.closeModal();
        },
      });
  }

  removeFile() {
    this.selectedFile.set(null);
  }

  uploadFile() {
    const file = this.selectedFile();
    if (file) {
      this.onUploadCompanyLogo(file);
    }
  }
}
