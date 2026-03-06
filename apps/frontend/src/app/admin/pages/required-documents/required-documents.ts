import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Button } from '../../../common/components/button/button';
import { RequiredDocumentsService } from '../../services/required-documents.service';
import { take } from 'rxjs';
import {
  HttpResponseInterface,
  NotificationStatusEnum,
  PaginatedData,
  RequiredDocument,
} from '@newmbani/types';
import { NotificationService } from '../../../common/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';
import { ViewRequiredDocument } from './modals/view-required-document/view-required-document';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ManageRequiredDocument } from './modals/manage-required-document/manage-required-document';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-required-documents',
  imports: [Button, DatePipe],
  templateUrl: './required-documents.html',
  styleUrl: './required-documents.scss',
})
export class RequiredDocuments implements OnInit {
  documents = signal<RequiredDocument[]>([]);
  isLoading = signal<boolean>(false);

  private readonly requiredDocumentsService = inject(RequiredDocumentsService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getDocuments();
  }

  getDocuments() {
    this.isLoading.set(true);
    this.requiredDocumentsService
      .getRequiredDocuments()
      .pipe(take(1))
      .subscribe({
        next: (
          res: HttpResponseInterface<PaginatedData<RequiredDocument[]>>
        ) => {
          //
          this.documents.set(res.data.data);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.notify({
            title: 'Error!',
            status: NotificationStatusEnum.ERROR,
            message: error.error.message,
          });
          this.isLoading.set(false);
        },
      });
  }

  addDocument() {
    const modalRef = this.dialog.open(ManageRequiredDocument, {});
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        if (!res) return; // Modal closed without submitting a document
        const document = res as RequiredDocument;
        this.documents.set([document, ...this.documents()]);
      });
  }

  opendocumentDetails(document: any) {
    const modalRef = this.dialog.open(ViewRequiredDocument, {
      data: document,
    });
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        if (!res) return;
        const { document, edit } = res;
        if (edit && document) {
          const modalRef = this.dialog.open(ManageRequiredDocument, {
            data: document,
          });
          modalRef.closed
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res: any) => {
              const document = res as RequiredDocument;
              const docs = this.documents();
              const index = docs.findIndex((doc) => doc._id === document._id);
              if (index !== -1) {
                docs[index] = document;
              }
              this.documents.set(docs);
            });
        }
      });
  }
}
