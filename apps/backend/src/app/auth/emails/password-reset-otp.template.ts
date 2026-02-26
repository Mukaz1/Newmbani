import { OTP, Settings, User } from '@newmbani/types';

export const PasswordResetOTPTemplate = (payload: {
  settings: Settings;
  user: User;
  otp: string;
  expiresIn: number;
}) => {
  const { otp, settings, user, expiresIn } = payload;
  const css = '';
  const template = `
  <div style="text-align: left;">
  <h1>Your One-Time Password (OTP)</h1>
  <p>Dear ${user.name},</p>
  <p>Your One-Time Password (OTP) for password reset is:</p>
  <h3 style="font-size: 46px; text-left: center;"> ${otp} </h3>
  <p>Please use this OTP within the next ${expiresIn} minutes to complete your action. Do not share this OTP with anyone for your security.</p>
  <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
  <p>Regards,
  <br> ${settings.general.company} Team
  </p>
  </div>
  `;

  return { template, css };
};
