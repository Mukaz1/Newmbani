import { Booking, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';
import { bookingDetailsTable } from '../utils/bookings-helper';


export const BookingRejectedLandlordTemplate = (settings: Settings, booking: Booking) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Rejected</h2>
      <p>Hi ${booking.property.landlord.name},</p>
      <p>
        You rejected the booking request for <strong>${booking.property.title}</strong>.
        The customer has been notified.
      </p>
      ${bookingDetailsTable(booking)}
      <p>Manage your bookings at <a href="${settings.appURL}/landlord/bookings">${settings.appURL}</a>.</p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});