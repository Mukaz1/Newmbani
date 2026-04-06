import { APIBaseAPIUrl } from '../../common/base-api-url';

const CUSTOMERS = `${APIBaseAPIUrl}/customers`;

export const customersEndpoints = {
  CREATE_CUSTOMER: CUSTOMERS,
  GET_CUSTOMERS: CUSTOMERS,
  GET_CUSTOMER: (id: string) => `${CUSTOMERS}/${id}`,
  UPDATE_CUSTOMER: (id: string) => `${CUSTOMERS}/${id}`,
} as const;
