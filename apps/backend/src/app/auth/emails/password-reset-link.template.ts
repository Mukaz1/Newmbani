import { Settings } from '@newmbani/types';

export const PasswordResetLinkTemplate = (
  settings: Settings,
  user: { name: string; email: string },
  resetLink: string,
) => {
  const template = `
  <div style="text-align: left;">
  <h1>Password Reset Request</h1>
  <p>Hello ${user.name},</p>
  <p>We received a request to reset your password. Click the link below to reset your password:</p>
  <a href="${resetLink}" class="reset-link">Reset Password</a>
  <p>If you did not request a password reset, please ignore this email.</p>
  <p>Thank you!</p>
  <br>Your ${settings.general.company} Team</p>
  </div>
  `;

  const css = '';

  return { template, css };
};
