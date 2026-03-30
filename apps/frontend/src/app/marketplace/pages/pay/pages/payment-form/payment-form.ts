import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaymentData } from '../pay';
import { Button } from '../../../../../common/components/button/button';

type PaymentMethod = 'mpesa' | 'pesapal';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, Button],
  templateUrl: './payment-form.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PaymentForm {
  fb = inject(FormBuilder);
  @Output() paymentSubmitted = new EventEmitter<PaymentData>();
  isLoading = input.required<boolean>();
  activeMethod = signal<PaymentMethod>('mpesa');

  pesapalForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{9}$/),
    ]),
  });

  mpesaForm: FormGroup = new FormGroup({
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{9}$/),
    ]),
  });
  selectedPesapalMethod = 'mpesa';

  pesapalMethods = [
    { value: 'mpesa', label: 'M-Pesa', suffix: '(via PesaPal)' },
    { value: 'card', label: 'Credit/Debit Card', suffix: null },
    { value: 'bank', label: 'Bank Transfer', suffix: null },
  ];

  selectPaymentMethod(method: PaymentMethod): void {
    this.activeMethod.set(method);
  }

  onSubmit(): void {
    let form: FormGroup;
    if (this.activeMethod() === 'mpesa') {
      form = this.mpesaForm;
    } else {
      form = this.pesapalForm;
    }

    if (!form.valid) {
      return;
    }

    const { phone, email } = form.value;

    this.paymentSubmitted.emit({
      phone: phone ?? '',
      email: email || '',
      paymentMethod: this.activeMethod(),
    });
  }
}
