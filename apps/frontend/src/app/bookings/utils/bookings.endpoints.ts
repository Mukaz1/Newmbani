import { APIBaseAPIUrl } from '../../common/base-api-url';

const BOOKINGS = `${APIBaseAPIUrl}/bookings`;

export const bookingsEndpoints = {
  CREATE_BOOKING: BOOKINGS,
  GET_BOOKINGS: BOOKINGS,
  GET_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
  UPDATE_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
  UPDATE_BOOKING_STATUS: (id: string) => `${BOOKINGS}/${id}/status`,
  DELETE_BOOKING: (id: string) => `${BOOKINGS}/${id}`,
};
