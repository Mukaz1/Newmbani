import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Landlord,
  LandlordDocument,
  LandlordDocumentStatus,
  NotificationStatusEnum,
} from '@newmbani/types';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';

import { Button } from '../../../../../common/components/button/button';
import { Dialog } from '@angular/cdk/dialog';
import { LandlordVerificationModal } from '../../modals/landlord-verification-modal/landlord-verification-modal';
import { MetaService } from '../../../../../common/services/meta.service';
import { take } from 'rxjs';
import { InitialsPipe } from '../../../../../common/pipes/initials.pipe';
import { LandlordsService } from '../../../../../landlords/services/landlords.service';
import { ViewFileViaModal } from '../../../../../utilities/view-file-via-modal/view-file-via-modal';
import { NotificationService } from '../../../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentVerificationModal } from '../../modals/document-verification-modal/document-verification-modal';
import { CdkMenu, CdkMenuModule, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-view-landlord',
  templateUrl: './view-landlord.html',
  styleUrl: './view-landlord.scss',
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
export class ViewLandlord implements OnInit {
  landlord = signal<Landlord | null>(null);
  landlordId!: string;
  isLoading = signal(false);

  // Injecting services
  private readonly landlordsService = inject(LandlordsService);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(Dialog);
  private metaService = inject(MetaService);

  LandlordDocumentStatus = LandlordDocumentStatus;

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Landlord Details',
            isClickable: false,
          },
        ],
      },
      title: 'Landlord Details',
      description: 'Landlord Details',
    });
  }

  ngOnInit(): void {
    this.landlordId = this.route.snapshot.params['id'];
    if (this.landlordId) {
      this.fetchLandlord();
    }
    this.allLandlordDocumentsApproved();
  }

  fetchLandlord() {
    this.isLoading.set(true);
    this.landlordsService
      .getLandlordProfileById(this.landlordId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.landlord.set(res.data as Landlord);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.isLoading.set(false);
        },
      });
  }

  verifyLandlordDialog() {
    if (!this.landlord) return;
    const dialogConfig = {
      data: { landlord: this.landlord() },
      disableClose: true,
    };
    const dialogRef = this.dialog.open(LandlordVerificationModal, dialogConfig);
    dialogRef.closed.subscribe(() => {
      this.fetchLandlord();
    });
  }

  verifyLandlord() {
    this.isLoading.set(true);
    const landlordId = this.landlord()?._id;
    if (!landlordId) return;
    this.landlordsService.approveLandlord(landlordId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.landlord.set(res.data);
        this.notificationService.notify({
          title: 'Verified',
          status: NotificationStatusEnum.SUCCESS,
          message: `Landlord ${this.landlord()?.displayName} verified successfully`,
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

  viewDocument(document: LandlordDocument) {
    this.dialog.open(ViewFileViaModal, {
      data: { fileId: document.fileId },
      disableClose: true,
    });
  }

  approveDocument(document: LandlordDocument) {
    const dialogRef = this.dialog.open(DocumentVerificationModal, {
      data: { document },
      disableClose: true,
    });

    dialogRef.closed.subscribe((result: unknown) => {
      this.fetchLandlord();
    });
  }

  allLandlordDocumentsApproved(): boolean {
    const documents = this.landlord()?.documents ?? [];
    const result =
      documents.length > 0 &&
      documents.every((doc) => doc.status === LandlordDocumentStatus.APPROVED);
    return result;
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
