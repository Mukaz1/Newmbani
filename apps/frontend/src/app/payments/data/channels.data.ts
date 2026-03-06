import { PaymentChannel, PaymentChannelsEnum } from '@newmbani/types';

export const paymentChannelsData: PaymentChannel[] = [
  {
    name: 'MPESA Payments',
    icon: '/assets/images/payments/mpesa.png',
    description: 'Receive MPESA Payments',
    channel: PaymentChannelsEnum.MPESA,
    isActive: true,
  },
  // {
  //   name: 'Cheque',
  //   icon: '/assets/icons/payments/cheque.png',
  //   description: 'Receive Cheque Payment',
  //   channel: PaymentChannelsEnum.CHEQUE,
  //   isActive: true,
  // },

  // {
  //   name: 'Bank Transfer',
  //   icon: '/assets/icons/payments/bank-transfer.png',
  //   description: 'Receive Bank Transfer',
  //   channel: PaymentChannelsEnum.BANK_TRANSFER,
  //   isActive: true,
  // },
  // {
  //   name: 'Bank Deposit',
  //   icon: '/assets/icons/payments/direct-deposit.png',
  //   description: 'Receive Bank Deposit',
  //   channel: PaymentChannelsEnum.BANK_DEPOSIT,
  //   isActive: true,
  // },
  // {
  //   name: 'Cash Payment',
  //   icon: '/assets/images/payments/cash.jpg',
  //   description: 'Receive Cash Payment',
  //   channel: PaymentChannelsEnum.CASH,
  //   isActive: true,
  // },
  // {
  //   name: 'Credit Note',
  //   icon: '/assets/icons/payments/credit-note.png',
  //   description: 'Pay using Credit Note',
  //   channel: PaymentChannelsEnum.CREDIT_NOTE,
  //   isActive: false,
  // },
];
