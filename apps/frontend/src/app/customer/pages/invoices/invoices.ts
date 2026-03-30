// import { Component, inject, OnInit, signal } from '@angular/core';
// import { DatePipe, UpperCasePipe } from '@angular/common';
// import { Pagination } from '../../../common/components/pagination/pagination';
// import { PaymentChannelWidget } from '../../../common/components/payment-channel-widget/payment-channel-widget';
// import { PricePipe } from '../../../common/pipes/price.pipe';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpResponseInterface, Invoice, PaginatedData } from '@newmbani/types';
// import { AuthService } from '../../../auth/services/auth.service';
// import { Dialog } from '@angular/cdk/dialog';
// import { MetaService } from '../../../common/services/meta.service';
// import { ViewFileViaModal } from '../../../utilities/view-file-via-modal/view-file-via-modal';
// import { CustomerInvoiceService } from '../../services/customer-invoice.service';
// import { take } from 'rxjs';
// import { DateRangePicker } from '../../../common/components/date-range-picker/date-range-picker';

// @Component({
//   selector: 'app-invoices',
//   imports: [
//     DatePipe,
//     Pagination,
//     PaymentChannelWidget,
//     PricePipe,
//     ReactiveFormsModule,
//     FormsModule,
//     UpperCasePipe,
//     DateRangePicker,
//   ],
//   templateUrl: './invoices.html',
//   styleUrl: './invoices.scss',
// })
// export class Invoices implements OnInit {
//   paginatedData = signal<PaginatedData<Invoice[]> | undefined>(undefined);
//   invoices = signal<Invoice[]>([]);
//   currentPage = 1;
//   pageSize = 10;
//   searchTerm = '';

//   private readonly customerInvoiceService = inject(CustomerInvoiceService);
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

//   async ngOnInit() {
//     await this.getCustomerInvoices();
//   }

//   changePageSize(pageSize: number) {
//     if (pageSize !== this.pageSize) {
//       this.pageSize = +pageSize;
//       this.currentPage = 1;
//       this.getCustomerInvoices();
//     }
//   }

//   pageChange(page: number) {
//     this.currentPage = page;
//     this.getCustomerInvoices();
//   }

//   // async getCustomerInvoices() {
//   //   const user = this.authService.getStoredUser();
//   //   if (!user) return;
//   //   const { customerId } = user;
//   //   if (!customerId) return;
//   //   this.customerInvoiceService
//   //     .getClientInvoices(customerId)
//   //     .pipe(take(1))
//   //     .subscribe({
//   //       next: (response: HttpResponseInterface<PaginatedData<Invoice[]>>) => {
//   //         this.invoices.set(response.data.data);
//   //         this.paginatedData.set(response.data);
//   //       },
//   //     });
//   // }

//   viewInvoicePDF(invoice: Invoice) {
//     this.dialog.open(ViewFileViaModal, {
//       data: { url: invoice.invoiceLink },
//       disableClose: true,
//     });
//   }
// }
