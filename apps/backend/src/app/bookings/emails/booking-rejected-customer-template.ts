import { Booking, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';
import { bookingDetailsTable } from '../utils/bookings-helper';


export const BookingRejectedCustomerTemplate = (settings: Settings, booking: Booking) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color:#dc2626;">Booking Not Approved</h2>
      <p>Hi ${booking.customer.name},</p>
      <p>
        Unfortunately, your booking for <strong>${booking.property.title}</strong> was
        <strong style="color:#dc2626;">not approved</strong> by the landlord.
        You can browse other available properties and try again.
      </p>
      ${bookingDetailsTable(booking)}
      <p><a href="${settings.appURL}/properties">Browse Properties</a></p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});