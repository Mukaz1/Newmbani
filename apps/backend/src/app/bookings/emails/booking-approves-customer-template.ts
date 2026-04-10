import { Booking, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';
import { bookingDetailsTable } from '../utils/bookings-helper';


export const BookingApprovedCustomerTemplate = (settings: Settings, booking: Booking) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color:#16a34a;">Booking Approved 🎉</h2>
      <p>Hi ${booking.customer.name},</p>
      <p>
        Great news! Your booking for <strong>${booking.property.title}</strong> has been
        <strong style="color:#16a34a;">approved</strong>.
        Please arrive on time for your viewing.
      </p>
      ${bookingDetailsTable(booking)}
      <p>View your booking at <a href="${settings.appURL}/customer/bookings">${settings.appURL}</a>.</p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});