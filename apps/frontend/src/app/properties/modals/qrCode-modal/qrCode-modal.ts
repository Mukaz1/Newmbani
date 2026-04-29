import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Property, NotificationStatusEnum } from '@newmbani/types';
import { NotificationService } from '../../../common/services/notification.service';
import { PropertiesService } from '../../services/properties.service';

@Component({
  selector: 'app-qr-code-modal',
  imports: [],
  templateUrl: './qrCode-modal.html',
  styleUrl: './qrCode-modal.scss',
})
export class QrCodeModal implements OnInit {
  private data = inject(DIALOG_DATA);
  private dialogRef = inject(DialogRef);
  private propertiesService = inject(PropertiesService);
  private notificationService = inject(NotificationService);

  property: Property = this.data.property;
  mode: 'generate' | 'view' = this.data.mode;

  qrCode = signal<string | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    if (this.mode === 'view') {
      this.qrCode.set(this.property.qrCode || null);
    } else {
      this.generate();
    }
  }

  generate(): void {
    this.isLoading.set(true);

    this.propertiesService.generateQrCode(this.property._id).subscribe({
      next: (res) => {
        this.qrCode.set(res.data.qrCode);
        this.isLoading.set(false);

        this.notificationService.notify({
          title: 'Success',
          message: 'QR Code generated successfully',
          status: NotificationStatusEnum.SUCCESS,
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.notificationService.notify({
          title: 'Error',
          message: err.error?.message || 'Failed to generate QR code',
          status: NotificationStatusEnum.ERROR,
        });
      },
    });
  }

  download(): void {
    const link = document.createElement('a');
    link.href = this.qrCode()!;
    link.download = `${this.property.title}-qr.png`;
    link.click();
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
