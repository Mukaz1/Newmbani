/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { Router } from '@angular/router';
import { SettingsService } from '../../../settings/services/settings.service';
import {
  PaymentChannelsEnum,
  HttpResponseInterface,
  PaginatedData,
  HttpStatusCodeEnum,
  Customer,
  PaymentChannel,
  Invoice,
  Payment,
  Currency,
  SOCKET_NAMESPACES,
  SocketIoEnums,
} from '@newmbani/types';
import { NotificationStatusEnum } from '@newmbani/types';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import { CustomersService } from '../../../customer/services/customer.service';
import { MpesaPayment } from './payment-channels/mpesa-payment/mpesa-payment';
import { CashPayment } from './payment-channels/cash-payment/cash';
import { BankTransfer } from './payment-channels/bank-transfer/bank-transfer';
import { CreditNote } from './payment-channels/credit-note/credit-note';
import { ChequePayment } from './payment-channels/cheque-payment/cheque-payment';
import { InvoicesService } from '../../../invoices/invoices.service';
import { PricePipe } from '../../../common/pipes/price.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BankDeposit } from './payment-channels/bank-deposit/bank-deposit';
import { paymentChannelsData } from '../../data/channels.data';
import { DialogRef } from '@angular/cdk/dialog';
import { CurrencyService } from '../../../common/services/currency.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-receive-payment',
  templateUrl: './receive-payment.html',
  styleUrls: ['./receive-payment.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MpesaPayment,
    CashPayment,
    BankTransfer,
    CreditNote,
    BankTransfer,
    BankDeposit,
    ChequePayment,
    PricePipe,
    FormsModule,
    NgClass,
  ],
})
export class ReceivePayment implements OnInit {
  clients?: Customer[];
  invoices?: Invoice[];
  client?: Customer;
  clientSearchTerm = '';
  paymentChannels = PaymentChannelsEnum;
  customerId: string | undefined = undefined;
  name = '';
  invoiceSearchTerm = '';
  invoiceId: string | undefined = undefined;
  invoice?: Invoice;
  customersService = inject(CustomersService);
  settingsService = inject(SettingsService);
  notificationsService = inject(NotificationService);
  metaService = inject(MetaService);
  changeDetectorRef = inject(ChangeDetectorRef);
  router = inject(Router);
  invoicesService = inject(InvoicesService);
  destroyRef = inject(DestroyRef);

  // Enhanced search properties
  isSearchingClients = false;
  isSearchingInvoices = false;
  clientSearchError = '';
  invoiceSearchError = '';
  showClientDropdown = false;
  showInvoiceDropdown = false;
  selectedClientIndex = -1;
  selectedInvoiceIndex = -1;
  channels: PaymentChannel[] = paymentChannelsData;
  paymentChannel: PaymentChannel = this.channels[0];
  paymentForm = new FormGroup({
    clientSearchTerm: new FormControl<string>('', { nonNullable: true }),
    invoiceSearchTerm: new FormControl<string>('', { nonNullable: true }),
    currencyId: new FormControl<string>('', { nonNullable: true }),
  });

  dialogRef = inject(DialogRef);
  currencyService = inject(CurrencyService);
  currencies: Currency[] = this.currencyService.currencies;
  currencyId: string | undefined = undefined;

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Receive Payment',
            isClickable: false,
          },
        ],
      },
      title: 'Receive Payment',
      description: 'Receive Payment',
    });
  }

  ngOnInit(): void {
    this.setupCustomerSearch();
    this.setupInvoiceSearch();
    this.setupFormSubscriptions();
    this.getCurrencies();
    this.paymentForm
      .get('currencyId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currencyId) => {
        this.currencyId = currencyId;
        this.changeDetectorRef.detectChanges();
      });
  }

  getCurrencies() {
    this.currencies = this.currencyService.currencies;
  }
  /**
   * Sets up enhanced customer search with debouncing and error handling
   */
  private setupCustomerSearch(): void {
    this.customersService
      .getSocket(SOCKET_NAMESPACES.CUSTOMERS)
      .on(
        SocketIoEnums.customerSearch,
        (data: HttpResponseInterface<PaginatedData<Customer[] | null>>) => {
          this.isSearchingClients = false;
          if (data.statusCode === HttpStatusCodeEnum.OK) {
            this.clients = data.data?.data || [];
            this.clientSearchError = '';
            this.showClientDropdown = this.clients.length > 0;
          } else {
            this.clientSearchError =
              data.message || 'Failed to search customers';
            this.clients = [];
            this.showClientDropdown = false;
          }
          this.changeDetectorRef.detectChanges();
        }
      );

    // Handle search errors
    this.customersService
      .getSocket()
      .emit('customerSearchError', (error: any) => {
        this.isSearchingClients = false;
        this.clientSearchError = error.message || 'Search failed';
        this.clients = [];
        this.showClientDropdown = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Sets up invoice search functionality
   */
  private setupInvoiceSearch(): void {
    this.invoicesService
      .getSocket(SOCKET_NAMESPACES.INVOICES)
      .on(
        SocketIoEnums.invoiceSearch,
        (data: HttpResponseInterface<PaginatedData<Invoice[] | null>>) => {
          this.isSearchingInvoices = false;
          if (data.statusCode === HttpStatusCodeEnum.OK) {
            this.invoices = data.data?.data || [];
            this.invoiceSearchError = '';
            this.showInvoiceDropdown = this.invoices.length > 0;
          } else {
            this.invoiceSearchError =
              data.message || 'Failed to search invoices';
            this.invoices = [];
            this.showInvoiceDropdown = false;
          }
          this.changeDetectorRef.detectChanges();
        }
      );
  }

  /**
   * Sets up form subscriptions with debouncing
   */
  private setupFormSubscriptions(): void {
    // Client search with debouncing
    this.paymentForm
      .get('clientSearchTerm')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          if (!searchTerm || searchTerm.length < 2) {
            this.clients = [];
            this.showClientDropdown = false;
            this.isSearchingClients = false;
            this.clientSearchError = '';
            return of(null);
          }

          this.isSearchingClients = true;
          this.clientSearchTerm = searchTerm;
          this.showClientDropdown = true;
          this.selectedClientIndex = -1;

          // Emit socket message for customer search
          this.customersService.searchCustomer(searchTerm);
          return of(null);
        }),
        catchError((error) => {
          this.isSearchingClients = false;
          this.clientSearchError = error.message || 'Search failed';
          this.clients = [];
          this.showClientDropdown = false;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    // Invoice search with debouncing
    this.paymentForm
      .get('invoiceSearchTerm')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          if (!searchTerm || searchTerm.length < 2) {
            this.invoices = [];
            this.showInvoiceDropdown = false;
            this.isSearchingInvoices = false;
            this.invoiceSearchError = '';
            return of(null);
          }

          this.isSearchingInvoices = true;
          this.invoiceSearchTerm = searchTerm;
          this.showInvoiceDropdown = true;
          this.selectedInvoiceIndex = -1;

          // TODO: Implement invoice search
          this.invoicesService.searchInvoice(searchTerm, this.customerId);
          return of(null);
        }),
        catchError((error) => {
          this.isSearchingInvoices = false;
          this.invoiceSearchError = error.message || 'Search failed';
          this.invoices = [];
          this.showInvoiceDropdown = false;
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Enhanced client selection with validation
   */
  getSelectedClient(customerId: string): void {
    const client = this.clients?.find((c) => c._id === customerId);
    if (!client) {
      this.notificationsService.notify({
        title: 'ERROR!',
        message: 'Selected client not found',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    this.customerId = customerId;
    this.client = client;
    this.name = client.name || '';
    this.showClientDropdown = false;
    this.selectedClientIndex = -1;

    // Clear the search term to show the selected client
    this.paymentForm.patchValue(
      { clientSearchTerm: client.name },
      { emitEvent: false }
    );

    this.changeDetectorRef.detectChanges();

    this.notificationsService.notify({
      title: 'SUCCESS!',
      message: `Selected client: ${client.name}`,
      status: NotificationStatusEnum.SUCCESS,
    });
  }

  /**
   * Enhanced invoice selection with validation
   */
  getSelectedInvoice(invoiceId: string): void {
    const invoice = this.invoices?.find((i) => i._id === invoiceId);
    if (!invoice) {
      this.notificationsService.notify({
        title: 'ERROR!',
        message: 'Selected invoice not found',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    this.invoiceId = invoiceId;
    this.invoice = invoice;
    this.showInvoiceDropdown = false;
    this.selectedInvoiceIndex = -1;

    // Clear the search term to show the selected invoice
    this.paymentForm.patchValue(
      { invoiceSearchTerm: invoice.serial },
      { emitEvent: false }
    );

    this.changeDetectorRef.detectChanges();

    this.notificationsService.notify({
      title: 'SUCCESS!',
      message: `Selected invoice: ${invoice.serial}`,
      status: NotificationStatusEnum.SUCCESS,
    });
  }

  /**
   * Remove selected client
   */
  removeSelectedClient(): void {
    this.customerId = undefined;
    this.client = undefined;
    this.name = '';
    this.paymentForm.patchValue({ clientSearchTerm: '' }, { emitEvent: false });
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Remove selected invoice
   */
  removeSelectedInvoice(): void {
    this.invoiceId = undefined;
    this.invoice = undefined;
    this.paymentForm.patchValue(
      { invoiceSearchTerm: '' },
      { emitEvent: false }
    );
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Handle keyboard navigation for client dropdown
   */
  onClientKeyDown(event: KeyboardEvent): void {
    if (!this.clients || this.clients.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedClientIndex = Math.min(
          this.selectedClientIndex + 1,
          this.clients.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedClientIndex = Math.max(this.selectedClientIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (
          this.selectedClientIndex >= 0 &&
          this.selectedClientIndex < this.clients.length
        ) {
          this.getSelectedClient(this.clients[this.selectedClientIndex]._id);
        }
        break;
      case 'Escape':
        this.showClientDropdown = false;
        this.selectedClientIndex = -1;
        break;
    }
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Handle keyboard navigation for invoice dropdown
   */
  onInvoiceKeyDown(event: KeyboardEvent): void {
    if (!this.invoices || this.invoices.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedInvoiceIndex = Math.min(
          this.selectedInvoiceIndex + 1,
          this.invoices.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedInvoiceIndex = Math.max(this.selectedInvoiceIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (
          this.selectedInvoiceIndex >= 0 &&
          this.selectedInvoiceIndex < this.invoices.length
        ) {
          this.getSelectedInvoice(this.invoices[this.selectedInvoiceIndex]._id);
        }
        break;
      case 'Escape':
        this.showInvoiceDropdown = false;
        this.selectedInvoiceIndex = -1;
        break;
    }
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Handle click outside to close dropdowns
   */
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.client-search-container') &&
      !target.closest('.invoice-search-container')
    ) {
      this.showClientDropdown = false;
      this.showInvoiceDropdown = false;
      this.selectedClientIndex = -1;
      this.selectedInvoiceIndex = -1;
      this.changeDetectorRef.detectChanges();
    }
  }

  changePaymentChannel(channel: PaymentChannel): void {
    this.paymentChannel = channel;
    this.changeDetectorRef.detectChanges();
  }

  respondToHttpResponses(response: HttpResponseInterface) {
    try {
      if (response.statusCode !== HttpStatusCodeEnum.CREATED) {
        throw new Error(response.message);
      }

      this.notificationsService.notify({
        title: 'SUCCESS!',
        message: response.message,
        status: NotificationStatusEnum.SUCCESS,
      });
      const payment: { _id: string } = response.data;
      this.router.navigateByUrl(`/admin/payments/allocate/${payment._id}`);
    } catch (error: any) {
      return this.notificationsService.notify({
        title: 'ERROR!',
        message: error.message,
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  closeModal(payment: Payment | null): void {
    this.dialogRef.close(payment);
  }
}
