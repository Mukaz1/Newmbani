export enum DefaultQueuesEnum {
  SYNC_CLIENT_STATEMENT = 'sync-client-balances',
  SYNC_INVOICES = 'sync-invoices',
  SEND_EMAIL_ON_TASK_CREATED = 'send-email-on-new-task-created',
  SEND_EMAIL_ON_TASK_OVERDUE = 'send-email-on-task-overdue',
  REMOVE_UNKNOWN_INVOICES = 'remove-unknown-invoices',
  REMOVE_UNKNOWN_INVOICE = 'remove-unknown-invoice',

  // PROPERTY DEMO
  GENERATE_PROPERTIES = 'generate-properties',
  GENERATE_PROPERTY = 'generate-property',

  // Booking
  CREATE_BOOKING_INVOICE = 'create-booking-invoice',
  GENERATE_BOOKING_INVOICE_PDF = 'generate-booking-invoice-pdf',

  SEND_INVOICE_EMAIL = 'send-invoice-email',
  SEND_INVOICE_WHATSAPP = 'send-invoice-whatsapp',
  GENERATE_PAYMENT_LINK = 'generate-payment-link',
  SEND_PAYMENT_RECEIPT_EMAIL = 'send-payment-receipt-email',
}

export const QueuesEnum = {
  ...DefaultQueuesEnum,
};

export type QueuesEnum = typeof QueuesEnum;
