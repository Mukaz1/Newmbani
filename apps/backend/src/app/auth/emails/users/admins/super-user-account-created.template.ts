import { appName } from '@newmbani/shared';
import { RegisterEmployeeDto } from '../../../../employees/dto/register-employee.dto';

/**
 * Returns a template for a superuser account created email notification for an Property-style app.
 *
 * @param {RegisterEmployeeDto} employee - The superuser to send the email to.
 *
 * @returns {Object} An object containing HTML and CSS for the email template.
 */
export const SuperUserAccountCreatedEmailTemplate = (
  employee: RegisterEmployeeDto,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
    <h1>Welcome to ${appName} Admin!</h1>
    <p>Hi ${employee.name},</p>
    <p>
      We're excited to welcome you as a superuser on the ${appName} platform! As a member of our admin team, you'll help shape the experience for landlords and guests around the world.
    </p>
    <p>
      Your superuser account has been successfully created. You can now log in to the admin dashboard and start managing properties, users, and platform settings.
    </p>
    <p>
      <b>Login details:</b><br>
      <b>Email:</b> ${employee.email} <br>
      <b>Password:</b> ${employee.password}
    </p>
    <p>
      For security, please change your password after your first login.
    </p>
    <p>
      If you have any questions or need assistance, our support team is here to help.
    </p>
    <p>
      Thank you for joining the ${appName} team!<br>
      <br>
      Best regards,<br>
      The ${appName} Team
    </p>
  </div>
  `;

  return { template, css };
};
