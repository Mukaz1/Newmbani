import { Booking, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';
import { bookingDetailsTable } from '../utils/bookings-helper';


export const BookingCreatedLandlordTemplate = (settings: Settings, booking: Booking) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Booking Request</h2>
      <p>Hi ${booking.property.landlord.name},</p>
      <p>
        You have received a new booking request for <strong>${booking.property.title}</strong>.
        Please log in to your dashboard to approve or reject it.
      </p>
      ${bookingDetailsTable(booking)}
      <p>
        <a href="${settings.appURL}/landlord/bookings"
          style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
          Review Booking
        </a>
      </p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});