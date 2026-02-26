import { Address } from '../addresses';
import { AuditData } from '../audit';

export interface CreateTenant {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
  acceptTerms: boolean;
}

export interface Tenant extends CreateTenant, AuditData {}
