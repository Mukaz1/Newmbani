import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { PaymentForm } from './payment-form/payment-form';
import { PaymentSuccess } from './payment-success/payment-success';
import { AwaitingPayment } from './awaiting-payment/awaiting-payment';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import {
  InvoiceStatusEnum,
  SOCKET_NAMESPACES,
  SocketIoEnums,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Booking,
} from '@newmbani/types';
import { NotificationService } from '../../../../common/services/notification.service';
import { SocketService } from '../../../../socket.io/socket-io.service';
import { formatToMpesaNumber } from '@newmbani/utils';
import { PaymentsService } from '../../../../payments/services/payments.service';
import { BookingsService } from '../../../../bookings/services/bookings.service';
import { BookingSummary } from './booking-summary/booking-summary';
import { HttpErrorResponse } from '@angular/common/http';
import { MetaService } from '../../../../common/services/meta.service';
import { isPlatformBrowser } from '@angular/common';

export enum PaymentState {
  CHECKOUT = 'checkout',
  AWAITING = 'awaiting',
  SUCCESS = 'success',
}

export interface PaymentData {
  phone: string;
  email: string;
  paymentMethod: 'mpesa' | 'pesapal';
}

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [
    BookingSummary,
    PaymentForm,
    AwaitingPayment,
    PaymentSuccess,
  ],
  templateUrl: './pay.html',
})
export class Pay implements OnInit {
  PaymentState = PaymentState;
  currentState: PaymentState = PaymentState.CHECKOUT;
  paymentData: PaymentData | null = null;

  bookingId = signal<string | null>(null);
  invoice = computed(() => this.booking()?.invoice ?? null);
  booking = signal<Booking | null>(null);
  isLoading = signal(false);
  initiatedStk = signal(false);
  selectedMethod = signal<string>('mpesa');
  showSuccessModal = signal(false);
  InvoiceStatusEnum = InvoiceStatusEnum;
  error = signal<string | null>(null);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingsService = inject(BookingsService);
  private paymentsService = inject(PaymentsService);
  private socketService = inject(SocketService);
  private notificationService = inject(NotificationService);
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Pay',
            isClickable: false,
          },
        ],
      },
      title: 'Make Payment',
      description: 'Complete your booking payment securely and instantly.',
    });

    this.socketService
      .getSocket(SOCKET_NAMESPACES.MPESA)
      .on(
        SocketIoEnums.mpesaTransactionResponse,
        (res: HttpResponseInterface) => {
          console.log(res);
          if (res.statusCode === HttpStatusCodeEnum.OK) {
            this.currentState = PaymentState.SUCCESS;
          } else {
            this.currentState = PaymentState.CHECKOUT;
            this.error.set(res.message);
            this.notificationService.notify({
              message: res.message,
              status: NotificationStatusEnum.ERROR,
              title: 'Payment Error!',
            });
          }
        }
      );
  }

  ngOnInit(): void {
    this.bookingId.set(this.route.snapshot.paramMap.get('bookingId'));
    if (this.isBrowser) {
      this.getBooking();
    }
  }

  getBooking() {
    const bookingId = this.bookingId();

    if (!bookingId) {
      console.error('No bookingId available');
      this.router.navigateByUrl('/not-found');
      return;
    }
    if (bookingId) {
      this.bookingsService
        .getBookingById(bookingId)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.booking.set(response.data);
            this.isLoading.set(false);
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
            this.isLoading.set(false);
            // this.router.navigateByUrl('/not-found');
          },
        });
    }
  }

  onPaymentSubmitted(data: PaymentData): void {
    this.isLoading.set(true);
    this.error.set(null);
    // const invoiceId = this.booking()?.invoice._id;
    // const phoneNumber = formatToMpesaNumber(data.phone);
    // if (!phoneNumber) {
    //   this.notificationService.notify({
    //     message:
    //       'Please enter a valid Safaricom phone number in the format 7XXXXXXXX or 01XXXXXXXX',
    //     status: NotificationStatusEnum.ERROR,
    //     title: 'Invalid Phone Number',
    //   });
    //   return;
    // }
    // if (!invoiceId) return;
    // if (data.paymentMethod === 'mpesa') {
    //   this.paymentsService
    //     .sendStkPush({
    //       invoiceId: invoiceId.toString(),
    //       phoneNumber,
    //     })
    //     .pipe(take(1))
    //     .subscribe({
    //       next: (response) => {
    //         this.isLoading.set(false);
    //         this.error.set(null);
    //         this.paymentData = data;
    //         this.currentState = PaymentState.AWAITING;
    //       },
    //       error: (err: HttpErrorResponse) => {
    //         this.error.set(err.error.message ?? err.message);
    //         this.currentState = PaymentState.AWAITING;
    //         this.notificationService.notify({
    //           message:
    //             err?.error?.message || 'Payment failed. Please try again.',
    //           status: NotificationStatusEnum.ERROR,
    //           title: 'Payment Error',
    //         });
    //         this.isLoading.set(false);
    //       },
    //     });
    // } else {
    //   // TODO: handle pesapal payment here
    // }
  }

  onPaymentCancelled(): void {
    this.currentState = PaymentState.CHECKOUT;
    this.paymentData = null;
  }
  viewBooking() {
    this.router.navigate(['/customer']);
  }
}
