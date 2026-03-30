import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DataLoading } from '../../../../../common/components/data-loading/data-loading';

@Component({
  selector: 'app-awaiting-payment',
  imports: [DataLoading],
  templateUrl: './awaiting-payment.html',
  styleUrl: './awaiting-payment.scss',
})
export class AwaitingPayment {
  @Input() phone = '';
  @Output() cancelled = new EventEmitter<void>();
}