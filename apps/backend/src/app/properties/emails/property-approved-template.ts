import { Landlord, Property, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';

export const PropertyApprovedEmailTemplate = (
  settings: Settings,
  landlord: Landlord,
  property: Property,
) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Property Approved 🎉</h2>
      <p>Hi ${landlord.name},</p>
      <p>
        Great news! Your property <strong>${property.title}</strong> has been
        <strong style="color: #16a34a;">approved</strong> and is now live on ${appName}.
        Tenants can now find and book viewings for your property.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Property</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${property.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Status</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; color: #16a34a;"><strong>Approved</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Rent Price</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">KES ${property.rentPrice?.toLocaleString()}</td>
        </tr>
      </table>
      <p>
        Log in to your dashboard to manage your listing at
        <a href="${settings.appURL}">${settings.appURL}</a>.
      </p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});