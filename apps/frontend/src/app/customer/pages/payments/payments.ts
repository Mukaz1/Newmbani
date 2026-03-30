// import {
//   ChangeDetectionStrategy,
//   Component,
//   inject,
//   OnInit,
//   signal,
// } from '@angular/core';
// import { Router } from '@angular/router';
// import { Pagination } from '../../../common/components/pagination/pagination';
// import { PaymentChannelWidget } from '../../../common/components/payment-channel-widget/payment-channel-widget';
// import { PricePipe } from '../../../common/pipes/price.pipe';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {
//   HttpResponseInterface,
//   PaginatedData,
//   Payment,
//   SOCKET_NAMESPACES,
//   SocketIoEnums,
// } from '@newmbani/types';
// import { PaymentsService } from '../../../payments/services/payments.service';
// import { Dialog } from '@angular/cdk/dialog';
// import { MetaService } from '../../../common/services/meta.service';
// import { paymentChannelsData } from '../../../payments/data/channels.data';
// import { AuthService } from '../../../auth/services/auth.service';
// import { ViewFileViaModal } from '../../../utilities/view-file-via-modal/view-file-via-modal';
// import { DateRangePicker } from '../../../common/components/date-range-picker/date-range-picker';
// import { DatePipe, UpperCasePipe } from '@angular/common';

// @Component({
//   selector: 'app-payments',
//   imports: [
//     FormsModule,
//     Pagination,
//     PaymentChannelWidget,
//     PricePipe,
//     ReactiveFormsModule,
//     DateRangePicker,
//     DatePipe,
//     UpperCasePipe,
//   ],
//   templateUrl: './payments.html',
//   styleUrl: './payments.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class Payments implements OnInit {
//   paginatedData = signal<PaginatedData<Payment[]> | undefined>(undefined);
//   paymentsService = inject(PaymentsService);
//   transactions = signal<Payment[]>([]);
//   currentPage = 1;
//   pageSize = 10;
//   searchTerm = '';

//   private readonly router = inject(Router);
//   private readonly authService = inject(AuthService);
//   private readonly dialog = inject(Dialog);
//   private readonly metaService = inject(MetaService);

//   constructor() {
//     this.metaService.setMeta({
//       breadcrumb: {
//         links: [
//           {
//             linkTitle: 'Payments',
//             isClickable: false,
//           },
//         ],
//       },
//       title: 'Payments',
//       description: 'Payments',
//     });
//   }

//   changePageSize(pageSize: number) {
//     if (pageSize !== this.pageSize) {
//       this.pageSize = +pageSize;
//       this.currentPage = 1;
//       this.search();
//     }
//   }

//   pageChange(page: number) {
//     this.currentPage = page;
//     this.search();
//   }

//   ngOnInit() {
//     this.search();
//   }

//   search() {
//     const user = this.authService.getStoredUser();
//     if (!user) return;
//     const { customerId } = user;
//     if (!customerId) return;

//     this.paymentsService.searchPayments({
//       page: this.currentPage,
//       limit: this.pageSize,
//       keyword: this.searchTerm,
//       customerId,
//       invoiceId: '',
//     });
//     this.paymentsService
//       .getSocket(SOCKET_NAMESPACES.PAYMENTS)
//       .on(
//         SocketIoEnums.paymentsSearch,
//         (res: HttpResponseInterface<PaginatedData<Payment[]>>) => {
//           this.transactions.set(res.data?.data);
//           this.paginatedData.set(res.data);
//         }
//       );
//   }

//   getIcon(transaction: Payment): string {
//     return (
//       paymentChannelsData.find(
//         (channel) => channel.channel === transaction.paymentChannel
//       )?.icon || ''
//     );
//   }

//   async receivePayment() {
//     const dialogRef = this.dialog.open(ViewFileViaModal, {
//       data: {},
//       disableClose: true,
//     });

//     // get the latest transactions after receiving payment
//     dialogRef.closed.subscribe((res: any) => {
//       const transaction: Payment | null = res || null;

//       if (transaction) {
//         this.transactions.set([...this.transactions(), transaction]);
//         this.search();
//         this.openTransactionDetails(transaction);
//       }
//     });
//   }

//   openTransactionDetails(transaction: Payment) {
//     this.dialog.open(ViewFileViaModal, {
//       data: { url: transaction.receiptLink },
//       disableClose: true,
//     });
//   }
// }
