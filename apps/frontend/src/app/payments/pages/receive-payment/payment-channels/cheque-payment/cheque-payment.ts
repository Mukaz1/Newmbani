import {
  Component,
  Input,
  OnChanges,
  OnInit,
  inject,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../../common/services/notification.service';
import { ChequePaymentsService } from '../../../../services/cheque-payments.service';
import { ExtractHTMLInputDate } from '../../../../../common/helpers/date.helper';
import {
  CreateChequePayment,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Payment,
} from '@newmbani/types';
import { take } from 'rxjs';
import { Button } from '../../../../../common/components/button/button';

@Component({
  selector: 'app-cheque-payment',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './cheque-payment.html',
  styleUrl: './cheque-payment.scss',
})
export class ChequePayment implements OnChanges, OnInit {
  @Input({ required: true }) customerId: string | undefined = undefined;
  @Input({ required: true }) invoiceId: string | undefined = undefined;
  @Input({ required: true }) currencyId: string | undefined = undefined;
  @Input({ required: true }) name = '';
  paymentService = inject(ChequePaymentsService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  @Output() paymentSubmitted = new EventEmitter<Payment | null>();

  paymentForm = new FormGroup({
    customerId: new FormControl(this.customerId, [Validators.required]),
    currencyId: new FormControl(this.currencyId, [Validators.required]),
    invoiceId: new FormControl(this.invoiceId, []),
    chequeNumber: new FormControl('', [Validators.required]),
    drawerName: new FormControl('', [Validators.required]),
    bankName: new FormControl('', [Validators.required]),
    amountPaid: new FormControl(0, [Validators.required]),
    paymentDate: new FormControl(new Date().toISOString(), [
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
    if (changes['name'] && changes['name'].currentValue) {
      this.name = changes['name'].currentValue;
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

  setDrawerName() {
    this.paymentForm.get('drawerName')?.setValue(this.name);
  }

  submitPayment() {
    if (this.paymentForm.valid) {
      const {
        invoiceId,
        customerId,
        paymentDate,
        amountPaid,
        drawerName,
        chequeNumber,
        bankName,
        currencyId,
      } = this.paymentForm.value;

      if (
        !customerId ||
        !currencyId ||
        !drawerName ||
        !chequeNumber ||
        !bankName ||
        !paymentDate ||
        amountPaid === undefined
      ) {
        return;
      }
      const paymentData: CreateChequePayment = {
        invoiceId,
        customerId,
        paymentDate,
        amountPaid: Number(amountPaid),
        chequeNumber,
        bankName,
        drawerName,
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
