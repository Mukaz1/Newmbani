import { Global, Module } from '@nestjs/common';
import { OtpController } from './controllers/otp.controller';
import { OtpService } from './services/otp.service';
import { otpProviders } from './providers/otp.provider';
import { OtpAutomationService } from './services/otp-automation.service';

@Global()
@Module({
  controllers: [OtpController],
  providers: [OtpService, ...otpProviders, OtpAutomationService],
  exports: [OtpService],
})
export class OtpModule {
  //
}
