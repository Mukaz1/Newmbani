import { OTPModel } from '../schemas/otp.schema';
import { DatabaseModelEnums } from '@newmbani/types';

export const otpProviders = [
  {
    provide: DatabaseModelEnums.OTP,
    useFactory: () => OTPModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
