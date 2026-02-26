import { Controller, Post, Req } from '@nestjs/common';

@Controller('sms-webhook')
export class SmsWebhookController {
  @Post('onfon')
  async onfonSMSWebhook(@Req() req: any) {
    //
  }
}
