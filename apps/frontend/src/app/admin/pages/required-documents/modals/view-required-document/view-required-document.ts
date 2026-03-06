import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { RequiredDocument } from '@newmbani/types';
import { Button } from '../../../../../common/components/button/button';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-view-required-document',
  imports: [Button, DatePipe, NgClass],
  templateUrl: './view-required-document.html',
  styleUrl: './view-required-document.scss',
})
export class ViewRequiredDocument {
  document = inject<RequiredDocument>(DIALOG_DATA);
  currentYear = new Date().getFullYear();

  private dialogRef = inject(DialogRef);

  closeModal(): void {
    this.dialogRef.close();
  }
  edit(document: RequiredDocument) {
    this.dialogRef.close({ document, edit: true });
  }
}
