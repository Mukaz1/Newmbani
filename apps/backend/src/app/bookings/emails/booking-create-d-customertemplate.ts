import { Booking, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';
import { bookingDetailsTable } from '../utils/bookings-helper';


export const BookingCreatedCustomerTemplate = (settings: Settings, booking: Booking) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Request Received</h2>
      <p>Hi ${booking.customer.name},</p>
      <p>
        Your booking request for <strong>${booking.property.title}</strong> has been received
        and is currently <strong>pending approval</strong> from the landlord.
        We'll notify you once a decision has been made.
      </p>
      ${bookingDetailsTable(booking)}
      <p>You can view your bookings at <a href="${settings.appURL}/customer/bookings">${settings.appURL}</a>.</p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});