import { Booking } from '@newmbani/types';

export const bookingDetailsTable = (booking: Booking): string => `
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr>
      <td style="padding:8px;border:1px solid #e5e7eb;"><strong>Property</strong></td>
      <td style="padding:8px;border:1px solid #e5e7eb;">${booking.property.title}</td>
    </tr>
    <tr>
      <td style="padding:8px;border:1px solid #e5e7eb;"><strong>Customer</strong></td>
      <td style="padding:8px;border:1px solid #e5e7eb;">${booking.customer.name}</td>
    </tr>
    <tr>
      <td style="padding:8px;border:1px solid #e5e7eb;"><strong>Viewing Date</strong></td>
      <td style="padding:8px;border:1px solid #e5e7eb;">${new Date(booking.viewingDate).toDateString()}</td>
    </tr>
    <tr>
      <td style="padding:8px;border:1px solid #e5e7eb;"><strong>Status</strong></td>
      <td style="padding:8px;border:1px solid #e5e7eb;text-transform:capitalize;">${booking.status}</td>
    </tr>
  </table>
`;