import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/all-payments/all-payments').then(m => m.AllPayments),
  },
  {
    path: 'receive',
    loadComponent: () => import('./pages/receive-payment/receive-payment').then(m => m.ReceivePayment),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/payment-details/payment-details').then(m => m.PaymentDetails),
  },
];
