const BOOKINGS = '/api/bookings';

export const BOOKINGS_ENDPOINTS = {
  CREATE_BOOKING: BOOKINGS,
  GET_BOOKINGS: BOOKINGS,
  GET_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
  UPDATE_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
  DELETE_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
};

