import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { NgClass } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  description: string;
  message: string;
  headerIcon?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string; 
  confirmButtonIcon?: string;
  cancelButtonIcon?: string;
  confirmButtonStyle?: string;
  cancelButtonStyle?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [Button,NgClass],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  data = inject<ConfirmDialogData>(DIALOG_DATA, { optional: true });
  dialogRef = inject(DialogRef, { optional: true });
  title = this.data?.title || 'Confirm';
  description = this.data?.description || '';
  headerIcon = this.data?.headerIcon || 'bi-question-circle-fill';
  confirmButtonText = this.data?.confirmButtonText || 'Confirm';
  cancelButtonText = this.data?.cancelButtonText || 'Cancel';
  confirmButtonIcon = this.data?.confirmButtonIcon ? this.data.confirmButtonIcon :'';
  cancelButtonIcon = this.data?.cancelButtonIcon ? this.data.cancelButtonIcon :'';
  confirmButtonStyle = this.data?.confirmButtonStyle || 'bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors';
  cancelButtonStyle = this.data?.cancelButtonStyle || 'Cancel';
  message = this.data?.message || '';

  onCancel() {
    this.dialogRef?.close(false);
  }

  onConfirm() {
    this.dialogRef?.close(true);
  }
}