const LANDLORDS = '/api/landlords';

export const LandlordsEndpoints = {
  CREATE_LANDLORD: LANDLORDS,
  GET_LANDLORDS: LANDLORDS,
  GET_LANDLORD: (id: string) => `${LANDLORDS}/${id}`,
  UPDATE_LANDLORD: (id: string) => `${LANDLORDS}/${id}`,
} as const;

