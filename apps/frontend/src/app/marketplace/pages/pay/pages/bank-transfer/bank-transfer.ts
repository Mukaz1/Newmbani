import { Component } from '@angular/core';
import { PricePipe } from '../../../../../common/pipes/price.pipe';

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
}

@Component({
  selector: 'app-bank-transfer',
  imports: [PricePipe],
  templateUrl: './bank-transfer.html',
  styleUrl: './bank-transfer.scss',
})
export class BankTransfer {
  orderReference = '#0297509';
  orderDate = new Date();
  subtotal = 1.0;
  shippingCost = 0;
  totalAmount = 1.0;
  // Bank transfer details
  bankDetails: BankDetails = {
    bankName: 'Chase Bank',
    accountName: 'Aluxe Marketplace',
    accountNumber: '1234567890',
    routingNumber: '021000021',
  };
}
