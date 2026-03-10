import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import {
  LandlordDocument,
  RequiredDocument,
  Landlord,
  LandlordDocumentStatus,
} from '@newmbani/types';
import { take } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { DataLoading } from '../../../../common/components/data-loading/data-loading';
import { UploadDocumentModal } from '../../../modals/upload-document-modal/upload-document-modal';
import { Dialog } from '@angular/cdk/dialog';
import { ViewFileViaModal } from '../../../../utilities/view-file-via-modal/view-file-via-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { TitleCasePipe } from '@angular/common';
import { LandlordDocumentsService } from '../../../services/host-documents.service';
import { LandlordsService } from '../../../services/landlords.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [DataLoading, CdkMenuTrigger, CdkMenu, CdkMenuItem, TitleCasePipe],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements OnInit {
  private authService = inject(AuthService);
  private landlordsService = inject(LandlordsService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly landlordDocumentsService = inject(LandlordDocumentsService);
  private readonly notificationService = inject(NotificationService);

  LandlordDocumentStatus = LandlordDocumentStatus;
  requiredDocuments = signal<RequiredDocument[]>([]);
  landlordDocuments = signal<LandlordDocument[]>([]);
  landlord = signal<Landlord | null>(null);
  isLoading = signal<boolean>(true);

  currentUser = this.authService.user;
  landlordId = this.currentUser()?.landlordId;
  documentStatus = LandlordDocumentStatus;

  ngOnInit(): void {
    this.fetchLandlord();
  }

  fetchLandlord() {
    if (!this.landlordId) return;
    this.isLoading.set(true);
    this.landlordsService
      .getLandlordProfileById(this.landlordId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.landlord.set(res.data);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error(error);
        },
      });
  }

  uploadModal(document: LandlordDocument) {
    const modalRef = this.dialog.open(UploadDocumentModal, {
      disableClose: true,
      data: {
        document,
      },
    });
    modalRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.fetchLandlord();
    });
  }

  viewFile(document: LandlordDocument) {
    if (!document.fileId) return;
    this.dialog.open(ViewFileViaModal, {
      data: { fileId: document.fileId },
      disableClose: true,
    });
  }
}
