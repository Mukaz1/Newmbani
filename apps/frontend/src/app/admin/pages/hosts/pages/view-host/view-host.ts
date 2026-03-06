import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Host,
  HostDocument,
  HostDocumentStatus,
  NotificationStatusEnum,
} from '@newmbani/types';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';

import { Button } from '../../../../../common/components/button/button';
import { Dialog } from '@angular/cdk/dialog';
import { HostVerificationModal } from '../../modals/host-verification-modal/host-verification-modal';
import { MetaService } from '../../../../../common/services/meta.service';
import { take } from 'rxjs';
import { InitialsPipe } from '../../../../../common/pipes/initials.pipe';
import { HostsService } from '../../../../../landlords/services/hosts.service';
import { ViewFileViaModal } from '../../../../../utilities/view-file-via-modal/view-file-via-modal';
import { NotificationService } from '../../../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentVerificationModal } from '../../modals/document-verification-modal/document-verification-modal';
import { CdkMenu, CdkMenuModule, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-view-host',
  templateUrl: './view-host.html',
  styleUrl: './view-host.scss',
  imports: [
    DataLoading,
    DatePipe,
    CdkMenu,
    CdkMenuModule,
    CdkMenuTrigger,
    Button,
    TitleCasePipe,
    InitialsPipe,
    NgClass,
  ],
})
export class ViewHost implements OnInit {
  host = signal<Host | null>(null);
  hostId!: string;
  isLoading = signal(false);

  // Injecting services
  private readonly hostsService = inject(HostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(Dialog);
  private metaService = inject(MetaService);

  HostDocumentStatus = HostDocumentStatus;

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Host Details',
            isClickable: false,
          },
        ],
      },
      title: 'Host Details',
      description: 'Host Details',
    });
  }

  ngOnInit(): void {
    this.hostId = this.route.snapshot.params['id'];
    if (this.hostId) {
      this.fetchHost();
    }
    this.allHostDocumentsApproved();
  }

  fetchHost() {
    this.isLoading.set(true);
    this.hostsService
      .getHostProfileById(this.hostId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.host.set(res.data as Host);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.isLoading.set(false);
        },
      });
  }

  verifyHostDialog() {
    if (!this.host) return;
    const dialogConfig = {
      data: { host: this.host() },
      disableClose: true,
    };
    const dialogRef = this.dialog.open(HostVerificationModal, dialogConfig);
    dialogRef.closed.subscribe(() => {
      this.fetchHost();
    });
  }

  verifyHost() {
    this.isLoading.set(true);
    const hostId = this.host()?._id;
    if (!hostId) return;
    this.hostsService.approveHost(hostId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.host.set(res.data);
        this.notificationService.notify({
          title: 'Verified',
          status: NotificationStatusEnum.SUCCESS,
          message: `Host ${this.host()?.displayName} verified successfully`,
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

  viewDocument(document: HostDocument) {
    this.dialog.open(ViewFileViaModal, {
      data: { fileId: document.fileId },
      disableClose: true,
    });
  }

  approveDocument(document: HostDocument) {
    const dialogRef = this.dialog.open(DocumentVerificationModal, {
      data: { document },
      disableClose: true,
    });

    dialogRef.closed.subscribe((result: unknown) => {
      this.fetchHost();
    });
  }

  allHostDocumentsApproved(): boolean {
    const documents = this.host()?.documents ?? [];
    const result =
      documents.length > 0 &&
      documents.every((doc) => doc.status === HostDocumentStatus.APPROVED);
    return result;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
