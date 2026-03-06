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
  CreateBankDepositPayment,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Payment,
} from '@newmbani/types';
import { Button } from '../../../../../common/components/button/button';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { BankDepositPaymentsService } from '../../../../services/bank-deposit-payments.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { ExtractHTMLInputDate } from '../../../../../common/helpers/date.helper';

@Component({
  selector: 'app-bank-deposit',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './bank-deposit.html',
  styleUrl: './bank-deposit.scss',
})
export class BankDeposit implements OnChanges, OnInit {
  @Input({ required: true }) customerId: string | undefined = undefined;
  @Input({ required: true }) invoiceId: string | undefined = undefined;
  @Input({ required: true }) currencyId: string | undefined = undefined;

  @Input({ required: true }) name = '';
  paymentService = inject(BankDepositPaymentsService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  @Output() paymentSubmitted = new EventEmitter<Payment | null>();

  paymentForm = new FormGroup({
    customerId: new FormControl(this.customerId, [Validators.required]),
    currencyId: new FormControl(this.currencyId, [Validators.required]),
    invoiceId: new FormControl(this.invoiceId, []),
    accountNumber: new FormControl('', [Validators.required]),
    accountName: new FormControl('', [Validators.required]),
    depositReference: new FormControl('', [Validators.required]),
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
        accountNumber,
        accountName,
        depositReference,
        bankName,
        currencyId,
      } = this.paymentForm.value;

      if (
        !customerId ||
        !drawerName ||
        !currencyId ||
        !accountNumber ||
        !accountName ||
        !depositReference ||
        !bankName ||
        !paymentDate ||
        amountPaid === undefined
      ) {
        return;
      }
      const paymentData: CreateBankDepositPayment = {
        invoiceId,
        customerId,
        paymentDate,
        amountPaid: Number(amountPaid),
        bankName,
        drawerName,
        accountNumber,
        depositReference,
        currencyId,
        accountName,
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
