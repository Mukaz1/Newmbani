const BOOKINGS = '/api/bookings';

export const bookingsEndpoints = {
  CREATE_BOOKING: BOOKINGS,
  GET_BOOKINGS: BOOKINGS,
  GET_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
  UPDATE_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
  DELETE_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
};

