import { AuditData } from "../audit";

export interface CreateCountry {
  name: string;
  code: string;
  flag?: string;
  supported: boolean;
  mobileCode: string;
  taxRate: number;
}

export interface Country extends CreateCountry, Omit<AuditData, 'createdBy'> {
  createdBy?: string;
}

// New interface for updating countries
export interface UpdateCountry {
  supported?: boolean;
  taxRate?: number;
}
