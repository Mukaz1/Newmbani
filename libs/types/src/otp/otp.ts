import { OTPUseEnum } from './enums/otp-use.enum';

export interface OTP extends CreateOTP {
  _id: string;
}

export interface CreateOTP {
  code: string;
  phone?: string;
  token?: string;
  email?: string;
  use: OTPUseEnum;
  isActive: boolean;
  expiry: number;
}
