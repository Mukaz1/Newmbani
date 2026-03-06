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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CreateManualMpesaPayment,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  Payment,
} from '@newmbani/types';
import { ExtractHTMLInputDate } from '../../../../../common/helpers/date.helper';
import { Button } from '../../../../../common/components/button/button';
import { ManualMpesaPaymentsService } from '../../../../services/manual-mpesa-payments.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../../common/services/notification.service';
import { NotificationStatusEnum } from '@newmbani/types';

@Component({
  selector: 'app-mpesa-payment',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './mpesa-payment.html',
  styleUrl: './mpesa-payment.scss',
})
export class MpesaPayment implements OnInit, OnChanges {
  @Input({ required: true }) customerId: string | undefined = undefined;
  @Input({ required: true }) invoiceId: string | undefined = undefined;
  @Input({ required: true }) currencyId: string | undefined = undefined;

  paymentService = inject(ManualMpesaPaymentsService);
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
    mpesaReference: new FormControl('', [Validators.required]),
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
      const {
        invoiceId,
        mpesaReference,
        customerId,
        paymentDate,
        amountPaid,
        currencyId,
      } = this.paymentForm.value;

      if (
        !mpesaReference ||
        !currencyId ||
        !customerId ||
        !paymentDate ||
        amountPaid === undefined
      ) {
        return;
      }

      const paymentData: CreateManualMpesaPayment = {
        invoiceId,
        customerId,
        mpesaReference,
        paymentDate: new Date(paymentDate),
        amountPaid: Number(amountPaid),
        currencyId,
      };
      this.paymentService
        .create(paymentData)
        .pipe(take(1))
        .subscribe({
          next: (result: HttpResponseInterface<Payment>) => {
            if (
              result.statusCode === HttpStatusCodeEnum.CREATED ||
              result.statusCode === HttpStatusCodeEnum.OK
            ) {
              this.notificationService.notify({
                status: NotificationStatusEnum.SUCCESS,
                message: result.message,
                title: 'Payment Success',
              });
              this.paymentSubmitted.emit(result.data);
            }
            this.notificationService.notify({
              status: NotificationStatusEnum.ERROR,
              message: result.message || 'Failed to create payment',
              title: 'Payment Error',
            });
          },
          error: (error: any) => {
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
