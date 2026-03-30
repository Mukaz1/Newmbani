import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface PaymentStatus {
  success: boolean;
  message: string;
}

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

@Component({
  selector: 'app-credit-card',
  imports: [ReactiveFormsModule, FormsModule,],
  templateUrl: './credit-card.html',
  styleUrl: './credit-card.scss',
})
export class CreditCard {
  isProcessing = false;
  paymentStatus: PaymentStatus | null = null;
  // Credit card form
  cardForm: FormGroup;
  savedCards: SavedCard[] = [
    { id: '1', brand: 'visa', last4: '1420', expiryMonth: 12, expiryYear: 25 },
    {
      id: '2',
      brand: 'mastercard',
      last4: '2020',
      expiryMonth: 8,
      expiryYear: 26,
    },
  ];
  totalAmount = 1.0;
  selectedCardId = '';

  private fb = inject(FormBuilder);

  constructor() {
    this.cardForm = this.createCardForm();
  }

  private createCardForm(): FormGroup {
    return this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9\s]{13,19}$/)],
      ],
      cardholderName: ['', [Validators.required, Validators.minLength(2)]],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
    });
  }

  // Credit card payment handlers
  onCardPaymentSubmit() {
    if (this.cardForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      this.paymentStatus = null;

      const formData = this.cardForm.value;

      // Simulate API call
      this.processCardPayment(formData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.cardForm.controls).forEach((key) => {
        this.cardForm.get(key)?.markAsTouched();
      });
    }
  }

  private async processCardPayment(cardData: any) {
    try {
      // TODO: Replace with actual payment service call
      // Example: this.paymentService.processCardPayment(cardData, this.totalAmount)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment
      this.isProcessing = false;
      this.paymentStatus = {
        success: true,
        message:
          'Payment processed successfully! Your order is being confirmed.',
      };
    } catch (error) {
      this.isProcessing = false;
      this.paymentStatus = {
        success: false,
        message:
          'Payment failed. Please check your card details and try again.',
      };
      console.error('Credit card payment error:', error);
    }
  }

  // Utility methods
  formatCardNumber(event: any) {
    const value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length <= 19) {
      event.target.value = formattedValue;
      this.cardForm.patchValue({ cardNumber: formattedValue });
    }
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.cardForm.patchValue({ expiryDate: value });
  }

  getCardBrandIcon(brand: string): string {
    const icons: { [key: string]: string } = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
    };
    return icons[brand] || '💳';
  }

  maskCardNumber(last4: string): string {
    return `XXXX - XXXX - XXXX - ${last4}`;
  }
}
