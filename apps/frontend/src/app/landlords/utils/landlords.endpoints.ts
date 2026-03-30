const LANDLORDS = '/api/landlords';

export const landlordsEndpoints = {
  CREATE_LANDLORD: LANDLORDS,
  GET_LANDLORDS: LANDLORDS,
  GET_LANDLORD: (id: string) => `${LANDLORDS}/${id}`,
  UPDATE_LANDLORD: (id: string) => `${LANDLORDS}/${id}`,
} as const;

