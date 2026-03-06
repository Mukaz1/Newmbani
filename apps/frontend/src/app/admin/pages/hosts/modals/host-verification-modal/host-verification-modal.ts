import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Button } from '../../../../../common/components/button/button';
import { Host, NotificationStatusEnum } from '@newmbani/types';
import { HostsService } from '../../../../../landlords/services/hosts.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { error } from 'node:console';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-host-verification-modal',
  imports: [ReactiveFormsModule, NgClass, Button],
  templateUrl: './host-verification-modal.html',
  styleUrl: './host-verification-modal.scss',
})
export class HostVerificationModal implements OnInit {
  isLoading = signal<boolean>(false);
  host = signal<Host | null>(null);

  private dialogRef = inject(DialogRef);
  private data = inject(DIALOG_DATA) as { host: Host };
  private hostsService = inject(HostsService);
  private notificationService = inject(NotificationService);

  hostVerificationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    verificationStatus: new FormControl('', [Validators.required]),
    comments: new FormControl(''),
  });

  ngOnInit(): void {
    this.host.set(this.data.host);
    if (!this.host) return;
    this.hostVerificationForm.patchValue({
      name: this.host()?.name,
      displayName: this.host()?.displayName,
      countryId: this.host()?.countryId,
    });
  }

  verifyHost() {
    this.isLoading.set(true);
    const hostId = this.host()?._id;
    if (!hostId) return;
    this.hostsService.approveHost(hostId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close({ verified: true, host: res.data });
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

  rejectHost() {
    // Set host.verified to false and close the modal with result
    this.isLoading.set(true);
    this.data.host.verified = false;
    this.isLoading.set(false);
    this.dialogRef.close({ verified: false, host: this.data.host });
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.hostVerificationForm.valid) {
      const formData = this.hostVerificationForm.value;
      if (formData.verificationStatus === 'approved') {
        this.verifyHost();
      } else if (formData.verificationStatus === 'rejected') {
        this.rejectHost();
      } else {
        this.closeModal();
      }
    } else {
      this.closeModal();
    }
  }
}
