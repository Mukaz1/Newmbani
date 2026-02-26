import { Settings, User } from '@newmbani/types';

/**
 * Returns a template for a landlord account created email notification.
 *
 * @param {Settings} settings - The application settings-wrapper.
 * @param {User} user - The user to send the email to.
 *
 * @returns {Object} An object containing HTML and CSS for the email template.
 */
export const AccountCreatedLandlordEmailTemplate = (
  settings: Settings,
  user: User,
): { template: string; css: string } => {
  const css = '';
  const template = `
  <div style="text-align: left;">
  <p>Dear ${user.name},</p>
  <p>We are thrilled to welcome you to ${settings.general.company}, your trusted partner for all your petroleum needs. Thank you for choosing us!</p>
  <p>Your account has been successfully created, and you are now a valued member of our petroleum family. With ${settings.general.company}, you'll have access to a wide range of petroleum properties and services designed to provide you with peace of mind and financial security.</p>
  <p>If you have any questions, need assistance, or want to explore our petroleum offerings, feel free to reach out to our dedicated customer support team. We're here to help you every step of the way.</p>
  <p> Use the following password to access your account ${user.password} for the first time. </p>
  <p>Once again, welcome to ${settings.general.company}. We look forward to serving you and ensuring your protection in the years to come.</p>
  <p>Best regards,
  <br>Yours ${settings.general.company} Team</p>
  </div>
  `;

  return { template, css };
};
