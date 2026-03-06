const CUSTOMERS = '/api/customers';

export const CUSTOMERS_ENDPOINTS = {
  CREATE_CUSTOMER: CUSTOMERS,
  GET_CUSTOMERS: CUSTOMERS,
  GET_CUSTOMER: (id: string) => `${CUSTOMERS}/${id}`,
  UPDATE_CUSTOMER: (id: string) => `${CUSTOMERS}/${id}`,
} as const;


