import { Settings, User } from '@newmbani/types';

/**
 * Returns a template for a tenant account created email notification for an Property-style app.
 *
 * @param {Settings} settings - The application settings-wrapper.
 * @param {User} user - The user to send the email to.
 *
 * @returns {Object} An object containing HTML and CSS for the email template.
 */
export const AccountCreatedTenantEmailTemplate = (
  settings: Settings,
  user: User,
): { template: string; css: string } => {
  const css = '';
  const template = `
  <div style="text-align: left;">
    <h1>Welcome to ${settings.general.company}!</h1>
    <p>Hi ${user.name},</p>
    <p>We're excited to have you join the ${
      settings.general.company
    } community!</p>
    <p>Your account has been successfully created. You can now start exploring unique stays, book your next adventure, or list your own property for guests around the world.</p>
    <p>To get started, log in to your account using your email address. ${
      user.password
        ? `Use the following password to sign in for the first time: <strong>${user.password}</strong>`
        : ''
    }</p>
    <p>Need help or have questions? Our support team is here for you—just reply to this email or visit our Help Center.</p>
    <p>We can't wait to see where you'll go next!</p>
    <p>Happy travels,<br>The ${settings.general.company} Team</p>
  </div>
  `;

  return { template, css };
};
