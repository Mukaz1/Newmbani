import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Invoice, Payment, PaymentChannel } from '@newmbani/types';
import { PricePipe } from '../../../common/pipes/price.pipe';
import { paymentChannelsData } from '../../data/channels.data';
import { DatePipe } from '@angular/common';
import { MetaService } from '../../../common/services/meta.service';

@Component({
  selector: 'app-payment-details',
  imports: [FormsModule, ReactiveFormsModule, PricePipe, DatePipe],
  templateUrl: './payment-details.html',
  styleUrl: './payment-details.scss',
})
export class PaymentDetails implements OnInit {
  data: { payment: Payment } = inject(DIALOG_DATA);
  payment = signal<Payment | null>(null);
  dialogRef = inject(DialogRef);
  invoices: Invoice[] = [];
  isLooading = signal(false);
  currentYear = new Date().getFullYear();

  private metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Payments Details',
            isClickable: false,
          },
        ],
      },
      title: 'Payments Details',
      description: 'Payments Details',
    });
  }

  ngOnInit() {
    const payment = this.data.payment;
    this.payment.set(payment);
  }

  getPaymentChannelIcon(): string {
    if (!this.payment()) {
      return '';
    }
    const dd: PaymentChannel | undefined = paymentChannelsData.find(
      (c) => c.channel === this.payment()?.paymentChannel
    );
    return dd ? dd.icon : '';
  }

  closeModal() {
    this.dialogRef.close();
  }
}
