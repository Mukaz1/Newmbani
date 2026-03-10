import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Button } from '../../../common/components/button/button';
import {
  NotificationStatusEnum,
  Property,
  PropertyApprovalStatus,
} from '@newmbani/types';
import { PropertiesService } from '../../services/properties.service';
import { NotificationService } from '../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-property-verification-modal',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './property-verification-modal.html',
  styleUrl: './property-verification-modal.scss',
})
export class PropertyVerificationModal implements OnInit {
  isLoading = signal<boolean>(false);
  property = signal<Property | null>(null);

  private dialogRef = inject(DialogRef);
  private data = inject(DIALOG_DATA) as { property: Property };
  private propertiesService = inject(PropertiesService);
  private notificationService = inject(NotificationService);

  PropertyApprovalStatus = PropertyApprovalStatus;

  propertyVerificationForm = new FormGroup({
    status: new FormControl('', [Validators.required]),
    comments: new FormControl(''),
  });

  ngOnInit(): void {
    const property = this.data.property;
    if (!property) return;
    this.property.set(property);
  }

  handlePropertyReview(status: PropertyApprovalStatus) {
    this.isLoading.set(true);
    const property = this.property();
    if (!property || !property._id) return;

    this.propertiesService
      .reviewProperty({
        propertyId: property._id,
        status,
        comment: this.propertyVerificationForm.value.comments || '',
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          const isApproved = status === PropertyApprovalStatus.APPROVED;
          this.dialogRef.close({ approved: isApproved, property: res.data });
          this.notificationService.notify({
            title: isApproved ? 'Property Approved' : 'Property Rejected',
            status: NotificationStatusEnum.SUCCESS,
            message: isApproved
              ? `Property "${property.name}" approved successfully.`
              : `Property "${property.name}" rejected.`,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            status: NotificationStatusEnum.ERROR,
            message:
              error.error?.message ||
              (status === PropertyApprovalStatus.APPROVED
                ? 'Failed to approve property.'
                : 'Failed to reject property.'),
          });
        },
      });
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.propertyVerificationForm.valid) {
      const formData = this.propertyVerificationForm.value;
      if (
        formData.status === PropertyApprovalStatus.APPROVED ||
        formData.status === PropertyApprovalStatus.REJECTED
      ) {
        this.handlePropertyReview(formData.status);
      } else {
        this.closeModal();
      }
    } else {
      this.closeModal();
    }
  }
}
