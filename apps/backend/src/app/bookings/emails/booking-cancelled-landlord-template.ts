import { Booking, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';
import { bookingDetailsTable } from '../utils/bookings-helper';


export const BookingCancelledLandlordTemplate = (settings: Settings, booking: Booking) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Cancelled</h2>
      <p>Hi ${booking.property.landlord.name},</p>
      <p>
        A booking for <strong>${booking.property.title}</strong> on
        <strong>${new Date(booking.viewingDate).toDateString()}</strong>
        has been cancelled by the customer.
      </p>
      ${bookingDetailsTable(booking)}
      <p>Manage your bookings at <a href="${settings.appURL}/landlord/bookings">${settings.appURL}</a>.</p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});