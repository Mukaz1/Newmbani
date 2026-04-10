import { Landlord, Property, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';

export const PropertySubmittedEmailTemplate = (
  settings: Settings,
  landlord: Landlord,
  property: Property,
) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Property Submitted for Review</h2>
      <p>Hi ${landlord.name},</p>
      <p>
        Your property <strong>${property.title}</strong> has been submitted successfully
        and is currently <strong>under review</strong>. Our team will assess it and notify
        you once a decision has been made.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Property</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${property.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Status</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">Under Review</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Rent Price</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">KES ${property.rentPrice?.toLocaleString()}</td>
        </tr>
      </table>
      <p>If you have any questions, contact us at <a href="mailto:${settings.general.email}">${settings.general.email}</a>.</p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});