import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PricePipe } from '../../../common/pipes/price.pipe';
import { Button } from '../../../common/components/button/button';
import {
  HttpResponseInterface,
  PaginatedData,
  Payment,
  SOCKET_NAMESPACES,
  SocketIoEnums,
} from '@newmbani/types';
import { paymentChannelsData } from '../../data/channels.data';
import { PaymentsService } from '../../services/payments.service';
import { Dialog } from '@angular/cdk/dialog';
import { PaymentDetails } from '../payment-details/payment-details';
import { Pagination } from '../../../common/components/pagination/pagination';
import { ReceivePayment } from '../receive-payment/receive-payment';
import { PaymentChannelWidget } from '../../../common/components/payment-channel-widget/payment-channel-widget';
import { FormsModule } from '@angular/forms';
import { MetaService } from '../../../common/services/meta.service';
import { DateRangePicker } from '../../../common/components/date-range-picker/date-range-picker';
import { DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-all-payments',
  imports: [
    RouterModule,
    PricePipe,
    Button,
    Pagination,
    DateRangePicker,
    PaymentChannelWidget,
    FormsModule,
    DatePipe,
    UpperCasePipe,
  ],
  templateUrl: './all-payments.html',
  styleUrl: './all-payments.scss',
})
export class AllPayments implements OnInit {
  router = inject(Router);
  paginatedData: PaginatedData<Payment[]> | null = null;
  paymentsService = inject(PaymentsService);
  payments: Payment[] = [];
  private readonly dialog = inject(Dialog);
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';

  private metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Payments',
            isClickable: false,
          },
        ],
      },
      title: 'Payments',
      description: 'Payments',
    });
  }

  changePageSize(pageSize: number) {
    if (pageSize !== this.pageSize) {
      this.pageSize = +pageSize;
      this.currentPage = 1;
      this.search();
    }
  }

  pageChange(page: number) {
    this.currentPage = page;
    this.search();
  }

  ngOnInit() {
    this.search();
  }

  search() {
    this.paymentsService.searchPayments({
      page: this.currentPage,
      limit: this.pageSize,
      keyword: this.searchTerm,
      customerId: '',
      invoiceId: '',
    });
    this.paymentsService
      .getSocket(SOCKET_NAMESPACES.PAYMENTS)
      .on(
        SocketIoEnums.paymentsSearch,
        (res: HttpResponseInterface<PaginatedData<Payment[]>>) => {
          this.payments = res.data?.data || [];
          this.paginatedData = res.data;
        }
      );
  }

  getIcon(payment: Payment): string {
    return (
      paymentChannelsData.find(
        (channel) => channel.channel === payment.paymentChannel
      )?.icon || ''
    );
  }

  async receivePayment() {
    const dialogRef = this.dialog.open(ReceivePayment, {
      data: {},
      disableClose: true,
    });

    // get the latest payments after receiving payment
    dialogRef.closed.subscribe((res: any) => {
      const payment: Payment | null = res || null;

      if (payment) {
        this.payments.push(payment);
        this.search();
        this.openTransactionDetails(payment);
      }
    });
  }

  openTransactionDetails(payment: Payment) {
    this.dialog.open(PaymentDetails, {
      data: { payment },
      disableClose: true,
    });
  }
}
