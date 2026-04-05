import { Invoice } from "@newmbani/types";

export interface FileGeneration {
  file: Buffer;
  invoice: Invoice;
}
