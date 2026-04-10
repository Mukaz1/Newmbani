import { Booking, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';
import { bookingDetailsTable } from '../utils/bookings-helper';


export const BookingCancelledCustomerTemplate = (settings: Settings, booking: Booking) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Cancelled</h2>
      <p>Hi ${booking.customer.name},</p>
      <p>
        Your booking for <strong>${booking.property.title}</strong> on
        <strong>${new Date(booking.viewingDate).toDateString()}</strong> has been cancelled.
      </p>
      ${bookingDetailsTable(booking)}
      <p><a href="${settings.appURL}/properties">Browse other properties</a></p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});