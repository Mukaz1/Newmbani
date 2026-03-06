export interface CreateCountry {
  name: string;
  code: string;
  supported: boolean;
  mobileCode: string;
  taxRate: number;
  commissionRates: {
    service: {
      rate: number;
      currencyId?: string;
      isPercentage: boolean;
    };
    property: {
      rate: number;
      currencyId?: string;
      isPercentage: boolean;
    };
  };
  supporting: {
    landlord: boolean;
    customer: boolean;
  };
}

export interface Country extends CreateCountry {
  _id: string;
  updatedBy?: string;
  updatedAt?: Date;
}

// New interface for updating countries
export interface UpdateCountry {
  supported?: boolean;
  taxRate?: number;
  supporting?: {
    landlord?: boolean;
    customer?: boolean;
  };
  commissionRates?: {
    service?: {
      rate: number;
      isPercentage: boolean;
    };
    
    property?: {
      rate: number;
      isPercentage: boolean;
    };
  };
}
