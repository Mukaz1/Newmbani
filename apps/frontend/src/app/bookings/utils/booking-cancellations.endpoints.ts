import { APIBaseAPIUrl } from '../../common/base-api-url';

const BOOKING_CANCELLATIONS = `${APIBaseAPIUrl}/booking-cancellations`;

export const bookingCancellationsEndpoints = {
  CREATE_BOOKING_CANCELLATION: BOOKING_CANCELLATIONS,
  GET_BOOKING_CANCELLATIONS: BOOKING_CANCELLATIONS,
  GET_BOOKING_CANCELLATION: (id: string) => `${BOOKING_CANCELLATIONS}/${id}`,
};

export default bookingCancellationsEndpoints;
