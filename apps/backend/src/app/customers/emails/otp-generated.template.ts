import { Settings, User } from '@newmbani/types';
import { GenerateOTPDto } from '../../otp/dto/generate-otp.dto';

export const OTPGeneratedTemplate = (
  settings: Settings,
  user: User,
  otp: GenerateOTPDto,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
  <h1>Your One-Time Password (OTP)</h1>
  <p>Dear ${user.name},</p>
  <p>Your One-Time Password (OTP) for secure access to your account is:</p>
  <h3 class="otp" style="font-size: 46px; text-align: center;">[ ${otp.code} ]</h3>
  <p>Please use this OTP within the next 3 minutes to complete your action. Do not share this OTP with anyone for your security.</p>
  <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
  <p>Regards
  <br> ${settings.general.company} Team
  </p>
  </div>
  `;

  return { template, css };
};
