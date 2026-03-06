import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import {
  HostDocument,
  RequiredDocument,
  Host,
  HostDocumentStatus,
} from '@newmbani/types';
import { take } from 'rxjs';
import { HostDocumentsService } from '../../../services/host-documents.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { DataLoading } from '../../../../common/components/data-loading/data-loading';
import { UploadDocumentModal } from '../../../modals/upload-document-modal/upload-document-modal';
import { Dialog } from '@angular/cdk/dialog';
import { ViewFileViaModal } from '../../../../utilities/view-file-via-modal/view-file-via-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HostsService } from '../../../services/hosts.service';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [DataLoading, CdkMenuTrigger, CdkMenu, CdkMenuItem, TitleCasePipe],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements OnInit {
  private authService = inject(AuthService);
  private hostsService = inject(HostsService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostDocumentsService = inject(HostDocumentsService);
  private readonly notificationService = inject(NotificationService);

  HostDocumentStatus = HostDocumentStatus;
  requiredDocuments = signal<RequiredDocument[]>([]);
  hostDocuments = signal<HostDocument[]>([]);
  host = signal<Host | null>(null);
  isLoading = signal<boolean>(true);

  currentUser = this.authService.user;
  hostId = this.currentUser()?.hostId;
  documentStatus = HostDocumentStatus;

  ngOnInit(): void {
    this.fetchHost();
  }

  fetchHost() {
    if (!this.hostId) return;
    this.isLoading.set(true);
    this.hostsService
      .getHostProfileById(this.hostId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.host.set(res.data);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error(error);
        },
      });
  }

  uploadModal(document: HostDocument) {
    const modalRef = this.dialog.open(UploadDocumentModal, {
      disableClose: true,
      data: {
        document,
      },
    });
    modalRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.fetchHost();
    });
  }

  viewFile(document: HostDocument) {
    if (!document.fileId) return;
    this.dialog.open(ViewFileViaModal, {
      data: { fileId: document.fileId },
      disableClose: true,
    });
  }
}
