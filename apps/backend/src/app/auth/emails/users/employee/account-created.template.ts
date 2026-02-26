import { Settings, User } from '@newmbani/types';

/**
 * Returns a template for an employee account created email notification for an Property-style app.
 *
 * @param {Settings} settings - The application settings-wrapper.
 * @param {User} employee - The employee to send the email to.
 *
 * @returns {Object} An object containing HTML and CSS for the email template.
 */
export const EmployeeAccountCreatedEmailTemplate = (
  settings: Settings,
  employee: User,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
    <h1>Welcome to ${settings.general.company}!</h1>
    <p>Hi ${employee.name},</p>
    <p>Your employee account has been created for the ${
      settings.general.company
    } Property platform.</p>
    <p>You can now log in and start managing properties, bookings, and guests.</p>
    <p>
      <b>Email:</b> ${employee.email} <br>
      ${employee.password ? `<b>Password:</b> ${employee.password} <br>` : ''}
    </p>
    <p>
      Please change your password after your first login for security.
    </p>
    <p>
      If you have any questions, feel free to contact our support team.
    </p>
    <p>
      Best regards,<br>
      The ${settings.general.company} Team
    </p>
  </div>
  `;

  return { template, css };
};
