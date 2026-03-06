import { APIBaseAPIUrl } from '../common/base-api-url';

export const mpesaManual = {
  CREATE_MANUAL_MPESA_PAYMENT: `${APIBaseAPIUrl}/manual-mpesa-payments`,
  VIEW_MANUAL_MPESA_PAYMENT: `${APIBaseAPIUrl}/manual-mpesa-payments`,
  UPDATE_MANUAL_MPESA_PAYMENT: `${APIBaseAPIUrl}/manual-mpesa-payments`,
  DELETE_MANUAL_MPESA_PAYMENT: `${APIBaseAPIUrl}/manual-mpesa-payments`,
  VIEW_MANUAL_MPESA_PAYMENTS: `${APIBaseAPIUrl}/manual-mpesa-payments`,
};

export const cash = {
  CREATE_CASH_PAYMENT: `${APIBaseAPIUrl}/cash-payments`,
  VIEW_CASH_PAYMENT: `${APIBaseAPIUrl}/cash-payments`,
  UPDATE_CASH_PAYMENT: `${APIBaseAPIUrl}/cash-payments`,
  DELETE_CASH_PAYMENT: `${APIBaseAPIUrl}/cash-payments`,
  VIEW_CASH_PAYMENTS: `${APIBaseAPIUrl}/cash-payments`,
};

export const cheque = {
  CREATE_CHEQUE_PAYMENT: `${APIBaseAPIUrl}/cheque-payments`,
  VIEW_CHEQUE_PAYMENT: `${APIBaseAPIUrl}/cheque-payments`,
  UPDATE_CHEQUE_PAYMENT: `${APIBaseAPIUrl}/cheque-payments`,
  DELETE_CHEQUE_PAYMENT: `${APIBaseAPIUrl}/cheque-payments`,
  VIEW_CHEQUE_PAYMENTS: `${APIBaseAPIUrl}/cheque-payments`,
};

export const bankDeposit = {
  CREATE_BANK_DEPOSIT_PAYMENT: `${APIBaseAPIUrl}/bank-deposits`,
  VIEW_BANK_DEPOSIT_PAYMENT: `${APIBaseAPIUrl}/bank-deposits`,
  UPDATE_BANK_DEPOSIT_PAYMENT: `${APIBaseAPIUrl}/bank-deposits`,
  DELETE_BANK_DEPOSIT_PAYMENT: `${APIBaseAPIUrl}/bank-deposits`,
  VIEW_BANK_DEPOSIT_PAYMENTS: `${APIBaseAPIUrl}/bank-deposits`,
};

export const bankTransfers = {
  CREATE_BANK_TRANSFER_PAYMENT: `${APIBaseAPIUrl}/bank-transfers`,
  VIEW_BANK_TRANSFER_PAYMENT: `${APIBaseAPIUrl}/bank-transfers`,
  UPDATE_BANK_TRANSFER_PAYMENT: `${APIBaseAPIUrl}/bank-transfers`,
  DELETE_BANK_TRANSFER_PAYMENT: `${APIBaseAPIUrl}/bank-transfers`,
  VIEW_BANK_TRANSFER_PAYMENTS: `${APIBaseAPIUrl}/bank-transfers`,
};

export const paymentsEndpoints = {
  VIEW_PAYMENT: `${APIBaseAPIUrl}/payments`,
  UPDATE_PAYMENT: `${APIBaseAPIUrl}/payments`,
  DELETE_PAYMENT: `${APIBaseAPIUrl}/payments`,
  VIEW_PAYMENTS: `${APIBaseAPIUrl}/payments`,
}

export const paymentAllocations = {
  CREATE_PAYMENT_ALLOCATION: `${APIBaseAPIUrl}/payment-allocations`,
  VIEW_PAYMENT_ALLOCATION: `${APIBaseAPIUrl}/payment-allocations`,
  UPDATE_PAYMENT_ALLOCATION: `${APIBaseAPIUrl}/payment-allocations`,
  DELETE_PAYMENT_ALLOCATION: `${APIBaseAPIUrl}/payment-allocations`,
  VIEW_PAYMENT_ALLOCATIONS: `${APIBaseAPIUrl}/payment-allocations`,
};   

export const paymentEndpoints = {
  ...paymentsEndpoints,
  ...mpesaManual,
  ...cash,
  ...cheque,
  ...bankDeposit,
  ...bankTransfers,
  ...paymentAllocations
};
