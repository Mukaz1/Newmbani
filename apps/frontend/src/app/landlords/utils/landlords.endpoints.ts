import { APIBaseAPIUrl } from '../../common/base-api-url';

const LANDLORDS = `${APIBaseAPIUrl}/landlords`;

export const landlordsEndpoints = {
  CREATE_LANDLORD: LANDLORDS,
  GET_LANDLORDS: LANDLORDS,
  GET_LANDLORD: (id: string) => `${LANDLORDS}/${id}`,
  UPDATE_LANDLORD: (id: string) => `${LANDLORDS}/${id}`,
  APPROVE_LANDLORD: (id: string) => `${LANDLORDS}/${id}/approve`,
} as const;
