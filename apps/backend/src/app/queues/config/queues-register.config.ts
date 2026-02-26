import { QueuesEnum } from '@newmbani/types';

export const queuesRegister: { name: string }[] = [
  {
    name: QueuesEnum.SYNC_CLIENT_STATEMENT,
  },
  {
    name: QueuesEnum.SYNC_INVOICES,
  },

  {
    name: QueuesEnum.SEND_EMAIL_ON_TASK_CREATED,
  },
  {
    name: QueuesEnum.SEND_EMAIL_ON_TASK_OVERDUE,
  },
  {
    name: QueuesEnum.GENERATE_PROPERTIES,
  },
  {
    name: QueuesEnum.GENERATE_PROPERTY,
  },

  // INVOICES

  {
    name: QueuesEnum.CREATE_BOOKING_INVOICE,
  },
  {
    name: QueuesEnum.GENERATE_BOOKING_INVOICE_PDF,
  },
  {
    name: QueuesEnum.SEND_INVOICE_EMAIL,
  },
  {
    name: QueuesEnum.SEND_INVOICE_WHATSAPP,
  },

  // Payments
  {
    name: QueuesEnum.SEND_PAYMENT_RECEIPT_EMAIL,
  },

  {
    name: QueuesEnum.SEND_WHATSAPP_MESSAGE,
  },
];
