export enum InvoiceStatusEnum {
  Draft = 'draft',
  Pending = 'pending',
  Paid = 'paid',
  Cancelled = 'cancelled',
}

export interface InvoiceItem {
  _id?: string;
  name?: string;
  price?: number;
  total?: number;
  metadata?: any;
}

export interface Invoice {
  _id?: string;
  invoiceLink: string
  currencyId?: string;
  subTotal?: number;
  taxAmount?: number;
  taxRate?: number;
  totalAmount?: number;
  status?: InvoiceStatusEnum;
  items?: InvoiceItem[];
}
