import { Invoice } from '../invoices';

export interface FileGeneration {
  file: Buffer;
  invoice: Invoice;
}
