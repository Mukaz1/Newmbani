import { Settings } from '@newmbani/types';

export const MagicLoginLinkTemplate = (
  settings: Settings,
  user: { name: string; email: string },
  href: string,
) => {
  const template = `
    <div style="text-align: left;">
    <h4>Passwordless Login Link</h4>
    <p>Dear ${user.name},</p>
    <p>We received a request to login to your account using a passwordless link. Click the link below to proceed:</p>
    <a href="${href}" style="
    padding: 8px 20px;
    background-color: #27963a;
    text-decoration: none;
    color: #060f3d;
    font-size: 14px;
    border-radius: 5px;
  " target="_blank">Click the link to access your account</a>
  <p>If you cannot click the link above, copy this link and paste in your browser: <a href="${href}" target="_blank"> ${href}</a> </p>
    <p>If you did not request a login link, please ignore this email.</p>
    <p>Thank you!</p>
    <br>${settings.general.company} Team</p>
    </div>
    `;

  const css = '';

  return { template, css };
};
