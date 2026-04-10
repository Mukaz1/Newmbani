import { Landlord, Property, Settings } from '@newmbani/types';
import { appName } from '@newmbani/shared';

export const PropertyRejectedEmailTemplate = (
  settings: Settings,
  landlord: Landlord,
  property: Property,
) => ({
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Property Not Approved</h2>
      <p>Hi ${landlord.name},</p>
      <p>
        Unfortunately, your property <strong>${property.title}</strong> was
        <strong style="color: #dc2626;">not approved</strong> at this time.
        Please review the feedback below and make the necessary changes before resubmitting.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Property</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${property.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Status</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; color: #dc2626;"><strong>Rejected</strong></td>
        </tr>
        ${property.reviewComment ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Review Comment</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${property.reviewComment}</td>
        </tr>` : ''}
      </table>
      <p>
        Log in to your dashboard to update and resubmit your listing at
        <a href="${settings.appURL}">${settings.appURL}</a>.
      </p>
      <p>
        If you believe this was a mistake, contact us at
        <a href="mailto:${settings.general.email}">${settings.general.email}</a>.
      </p>
      <p>Regards,<br/>${appName} Team</p>
    </div>
  `,
  css: '',
});