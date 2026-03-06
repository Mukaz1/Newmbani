import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  inject,
  input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentsService } from '../../services/payments.service';
import { Stk } from '../../types/mpesa';
import { take } from 'rxjs';
import { Booking, HttpResponseInterface } from '@newmbani/types';
import { PricePipe } from '../../../../../common/pipes/price.pipe';

interface PaymentResult {
  success: boolean;
  error?: unknown;
  message: string;
}

@Component({
  selector: 'app-mpesa',
  imports: [ReactiveFormsModule, CommonModule, PricePipe],
  templateUrl: './mpesa.html',
  styleUrl: './mpesa.scss',
})
export class MpesaComponent implements OnInit {
  booking = input.required<Booking>();
  @Output() paymentSubmitted = new EventEmitter<any>();
  @Output() paymentCompleted = new EventEmitter<PaymentResult>();

  mpesaForm: FormGroup;
  isProcessing = false;
  errorMessage = '';
  successMessage = '';

  // Phone number validation pattern for Kenyan numbers
  private phonePattern = /^(254|0)[0-9]{9}$/;

  private fb = inject(FormBuilder);
  private paymentsService = inject(PaymentsService);

  constructor() {
    this.mpesaForm = this.createForm();
  }

  ngOnInit() {
    // Set default values if provided
    if (this.booking().invoice.serial) {
      this.mpesaForm.patchValue({
        accountNumber: `#${this.booking().invoice.serial}`,
      });
    }
    if (this.booking().invoice.serial) {
      this.mpesaForm.patchValue({
        transactionDesc: `Payment for booking ${this.booking().invoice.serial}`,
      });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(this.phonePattern)],
      ],
      accountNumber: ['', Validators.required],
      transactionDesc: ['', Validators.required],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.mpesaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Convert 0XXXXXXXXX to 254XXXXXXXXX
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '254' + cleaned.substring(1);
    }

    return cleaned;
  }

  onSubmit() {
    if (this.mpesaForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData: Stk = {
        phoneNumber: this.formatPhoneNumber(this.mpesaForm.value.phoneNumber),
        amount: this.booking().invoice.amountDue,
        accountNumber: this.mpesaForm.value.accountNumber,
        transactionDesc: this.mpesaForm.value.transactionDesc,
      };

      // Emit the payment data to parent component
      this.paymentSubmitted.emit(formData);

      // Simulate API call (replace with actual service call)
      this.processPayment(formData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.mpesaForm.controls).forEach((key) => {
        this.mpesaForm.get(key)?.markAsTouched();
      });
    }
  }

  private async processPayment(paymentData: Stk) {
    try {
      this.paymentsService
        .stk(paymentData)
        .pipe(take(1))
        .subscribe({
          next: (res: HttpResponseInterface) => {
            // Simulate successful payment
            this.isProcessing = false;
            this.successMessage =
              res.message ??
              'Payment initiated successfully! Please check your phone for STK push notification.';
          },
        });
    } catch (error) {
      this.isProcessing = false;
      this.errorMessage =
        'Payment failed. Please try again or contact support.';
      console.error('M-Pesa payment error:', error);

      // Emit error event
      this.paymentCompleted.emit({
        success: false,
        error: error,
        message: this.errorMessage,
      });
    }
  }

  resetForm() {
    this.mpesaForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.isProcessing = false;
  }
}
