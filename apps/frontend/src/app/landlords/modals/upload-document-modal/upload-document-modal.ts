import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FileUploader } from '../../../common/components/file-uploader/file-uploader';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { take } from 'rxjs';
import { Button } from '../../../common/components/button/button';
import { NotificationService } from '../../../common/services/notification.service';
import {
  FileMimeGroups,
  LandlordDocument,
  NotificationStatusEnum,
} from '@newmbani/types';
import { LandlordDocumentsService } from '../../services/host-documents.service';

@Component({
  selector: 'app-upload-document-modal',
  imports: [FileUploader, Button],
  templateUrl: './upload-document-modal.html',
  styleUrl: './upload-document-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadDocumentModal implements OnInit {
  document: LandlordDocument | undefined = undefined;
  dialogRef = inject(DialogRef);
  selectedFile: File | undefined = undefined;
  isFileUploading = signal(false);
  data = inject<{ document: LandlordDocument | undefined }>(DIALOG_DATA);
  fileMimeGroups = FileMimeGroups;

  private landlordDocumentService = inject(LandlordDocumentsService);
  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.document = this.data.document;
  }

  closeModal() {
    this.dialogRef.close();
  }

  fileSelected(files: File[]) {
    this.selectedFile = files[0];
  }

  uploadFile() {
    if (this.selectedFile && this.document) {
      this.isFileUploading.set(true);
      this.landlordDocumentService
        .createLandlordDocument({
          hostId: this.document.hostId,
          documentId: this.document.documentId,
          file: this.selectedFile,
        })
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isFileUploading.set(false);
            this.notificationService.notify({
              title: 'Upload Success',
              status: NotificationStatusEnum.SUCCESS,
              message: 'Document uploaded successfully!',
            });
            this.dialogRef.close(res.data);
          },
          error: (error) => {
            this.isFileUploading.set(false);
            this.notificationService.notify({
              title: 'Upload Error',
              status: NotificationStatusEnum.ERROR,
              message: error.message,
            });
            console.log(error);
          },
        });
    }
  }

  // New method to resubmit a document
  resubmitDocument(expiryDate: string) {
    if (this.selectedFile && this.document) {
      this.isFileUploading.set(true);
      this.landlordDocumentService
        .resubmitLandlordDocument({
          documentId: this.document._id,
          expiryDate: expiryDate,
          file: this.selectedFile,
        })
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isFileUploading.set(false);
            this.notificationService.notify({
              message: 'Document resubmitted successfully.',
              title: 'Success',
              status: NotificationStatusEnum.SUCCESS,
            });
            this.dialogRef.close(res.data);
          },
          error: (error) => {
            this.isFileUploading.set(false);
            this.notificationService.notify({
              message: error.error?.message ?? error.message,
              title: 'Error',
              status: NotificationStatusEnum.ERROR,
            });
            console.error(error);
          },
        });
    }
  }
}
