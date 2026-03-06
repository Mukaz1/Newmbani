import { Component, Input } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentChannelsEnum } from '@newmbani/types';

@Component({
  selector: 'app-credit-note',
  imports: [],
  templateUrl: './credit-note.html',
  styleUrl: './credit-note.scss',
})
export class CreditNote {
  paymentChannel = PaymentChannelsEnum.CREDIT_NOTE;
  @Input({ required: true }) customerId: string | undefined = undefined;
  // create form
  paymentForm = new FormGroup({
    customerId: new FormControl('', [Validators.required]),
    paymentChannel: new FormControl(this.paymentChannel, [Validators.required]),
    amountPaid: new FormControl(0, [Validators.required]),
    paymentDate: new FormControl(new Date().toISOString(), [
      Validators.required,
    ]),

    // Credit Note
    creditNoteDate: new FormControl(new Date().toISOString(), [
      Validators.required,
    ]),
    creditNoteAmount: new FormControl(0, [Validators.required]),
    creditNoteAccount: new FormControl('', [Validators.required]),
  });
}
