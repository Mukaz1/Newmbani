import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  CreateCashPayment,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  Payment,
} from '@newmbani/types';
import { Button } from '../../../../../common/components/button/button';
import { CashPaymentsService } from '../../../../services/cash-payments.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { ExtractHTMLInputDate } from '../../../../../common/helpers/date.helper';
import { NotificationStatusEnum } from '@newmbani/types';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cash-payment',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './cash.html',
  styleUrl: './cash.scss',
})
export class CashPayment implements OnInit, OnChanges {
  @Input({ required: true }) customerId: string | undefined = undefined;
  @Input({ required: true }) invoiceId: string | undefined = undefined;
  @Input({ required: true }) currencyId: string | undefined = undefined;

  paymentService = inject(CashPaymentsService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  @Output() paymentSubmitted = new EventEmitter<Payment | null>();

  // create form
  paymentForm = new FormGroup({
    customerId: new FormControl(this.customerId, [Validators.required]),
    currencyId: new FormControl(this.currencyId, [Validators.required]),
    invoiceId: new FormControl(this.invoiceId),
    amountPaid: new FormControl(0, [Validators.required]),
    paymentDate: new FormControl(ExtractHTMLInputDate(new Date()), [
      Validators.required,
    ]),
  });
  ngOnChanges(changes: SimpleChanges) {
    if (changes['customerId'] && changes['customerId'].currentValue) {
      this.paymentForm
        .get('customerId')
        ?.setValue(changes['customerId'].currentValue);
      this.customerId = changes['customerId'].currentValue;
    }
    if (changes['invoiceId'] && changes['invoiceId'].currentValue) {
      this.paymentForm
        .get('invoiceId')
        ?.setValue(changes['invoiceId'].currentValue);
      this.invoiceId = changes['invoiceId'].currentValue;
    }

    if (changes['currencyId'] && changes['currencyId'].currentValue) {
      this.paymentForm
        .get('currencyId')
        ?.setValue(changes['currencyId'].currentValue);
      this.currencyId = changes['currencyId'].currentValue;
    }
  }

  ngOnInit(): void {
    this.paymentForm
      .get('paymentDate')
      ?.setValue(ExtractHTMLInputDate(new Date()));
  }

  submitPayment() {
    if (this.paymentForm.valid) {
      const { invoiceId, customerId, paymentDate, amountPaid, currencyId } =
        this.paymentForm.value;

      if (
        !customerId ||
        !paymentDate ||
        !currencyId ||
        amountPaid === undefined
      ) {
        return;
      }
      const paymentData: CreateCashPayment = {
        invoiceId,
        customerId,
        paymentDate,
        amountPaid: Number(amountPaid),
        currencyId,
      };

      this.paymentService
        .create(paymentData)
        .pipe(take(1))
        .subscribe({
          next: (result: HttpResponseInterface<Payment>) => {
            if (result.statusCode !== HttpStatusCodeEnum.CREATED) {
              this.notificationService.notify({
                status: NotificationStatusEnum.ERROR,
                message: result.message || 'Failed to create payment',
                title: 'Payment Error',
              });
              return;
            }
            this.notificationService.notify({
              status: NotificationStatusEnum.SUCCESS,
              message: result.message,
              title: 'Payment Success',
            });
            this.paymentSubmitted.emit(result.data);
          },
          error: (error: any) => {
            console.error(error.error.message);
            this.notificationService.notify({
              status: NotificationStatusEnum.ERROR,
              message: error.error.message || 'Failed to create payment',
              title: 'Payment Error',
            });
          },
        });
    } else {
      console.error('Payment form is invalid');
    }
  }
}
