import { Settings, User } from '@newmbani/types';

export const AccountVerificationOTPTemplate = (payload: {
  settings: Settings;
  user: User;
  otp: string;
  expiresIn: string;
}) => {
  const { otp, expiresIn, settings, user } = payload;
  const css = ``;
  const template = `
  <div style="text-align: left;">
  <h3>Account Verification OTP</h3>
  <p>Dear ${user.name},</p>
  <p>Your One-Time Password (OTP) to verify your account is:</p>
  <h3 style="font-size: 46px; text-align: left;">[ ${otp} ]</h3>
  <p>Please use this OTP within the next ${expiresIn} minutes to complete your action. Do not share this OTP with anyone for your security.</p>
  <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
  <p>Regards,
  <br> ${settings.general.company} Team
  </p>
  </div>
  `;

  return { template, css };
};
