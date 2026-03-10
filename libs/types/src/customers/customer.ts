import { Address } from '../addresses';
import { AuditData } from '../audit';

export interface CreateCustomer {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
  acceptTerms: boolean;
}

export interface UpdateCustomer {
  name: string;
  phone: string;
  password: string;
  address: Address;
}

export interface Customer extends CreateCustomer, AuditData {}
