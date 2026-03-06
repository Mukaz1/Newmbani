import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Button } from '../../../../../common/components/button/button';
import {
  NotificationStatusEnum,
  HostDocument,
  HostDocumentStatus,
} from '@newmbani/types';
import { HostDocumentsService } from '../../../../../landlords/services/host-documents.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-document-verification-modal',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './document-verification-modal.html',
  styleUrl: './document-verification-modal.scss',
})
export class DocumentVerificationModal implements OnInit {
  isLoading = signal<boolean>(false);
  document = signal<HostDocument | null>(null);

  private dialogRef = inject(DialogRef);
  private data = inject(DIALOG_DATA) as { document: HostDocument };
  private documentsService = inject(HostDocumentsService);
  private notificationService = inject(NotificationService);

  HostDocumentStatus = HostDocumentStatus;

  documentVerificationForm = new FormGroup({
    name: new FormControl(''),
    status: new FormControl('', [Validators.required]),
    comments: new FormControl(''),
  });

  ngOnInit(): void {
    this.document.set(this.data.document);
    if (!this.document()) return;
    // Set initial status if provided
    this.documentVerificationForm.patchValue({
      name: this.document()?.document.name || '',
      status: this.document()?.status || HostDocumentStatus.UNSUBMITTED,
    });
  }

  handleDocumentReview(status: HostDocumentStatus) {
    this.isLoading.set(true);
    const document = this.document();
    if (!document || !document._id) return;

    this.documentsService
      .reviewHostDocument({
        documentId: document._id,
        status,
        comment: this.documentVerificationForm.value.comments || '',
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          const isApproved = status === HostDocumentStatus.APPROVED;
          this.dialogRef.close({ approved: isApproved, document: res.data });
          this.notificationService.notify({
            title: isApproved ? 'Document Approved' : 'Document Rejected',
            status: NotificationStatusEnum.SUCCESS,
            message: isApproved
              ? `Document ${document.document.name} approved successfully.`
              : `Document ${document.document.name} rejected.`,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            status: NotificationStatusEnum.ERROR,
            message:
              error.error?.message ||
              (status === HostDocumentStatus.APPROVED
                ? 'Failed to approve document.'
                : 'Failed to reject document.'),
          });
        },
      });
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.documentVerificationForm.valid) {
      const formData = this.documentVerificationForm.value;
      if (
        formData.status === HostDocumentStatus.APPROVED ||
        formData.status === HostDocumentStatus.REJECTED
      ) {
        this.handleDocumentReview(formData.status);
      } else {
        this.closeModal();
      }
    } else {
      this.closeModal();
    }
  }
}
