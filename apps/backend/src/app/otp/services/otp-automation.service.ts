import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums, OTP, SystemEventsEnum } from '@newmbani/types';

@Injectable()
export class OtpAutomationService {
  private logger = new Logger(OtpAutomationService.name);

  constructor(@Inject(DatabaseModelEnums.OTP) private otp: Model<OTP>) {
    //
  }

  @OnEvent(SystemEventsEnum.OTP_USED, { async: true })
  async invalidateOTP(code: string) {
    try {
      await this.otp.findOneAndDelete({ code }).exec();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
