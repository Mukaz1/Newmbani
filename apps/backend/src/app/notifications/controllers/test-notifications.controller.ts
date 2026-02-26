import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SMSDto } from '../dto/sms.dto';
import { NotificationsService } from '../services/notifications.service';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';

@Controller('notification-demos')
export class TestNotificationsController {
  /**
   * Creates an instance of TestMailController.
   * @param {NotificationsService} notificationsService
   * @memberof TestMailController
   */
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Send Test Email
   *
   * @param {{ emails: string[] }} body
   * @return {*}
   * @memberof TestMailController
   */
  @Post('test-email')
  @UseGuards(AuthenticationGuard)
  async sendTestEmail(
    @Body() body: { emails: string[] },
    @GenericResponse() res: GenericResponse
  ) {
    // Send test email
    const response = await this.notificationsService.sendTestEmails(
      body.emails
    );
    // Set response status code

    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Send Test SMS
   *
   * @param {{ emails: string[] }} body
   * @return {*}
   * @memberof TestMailController
   */
  @Post('test-sms')
  @UseGuards(AuthenticationGuard)
  async sendTestSMS(@Body() sms: SMSDto) {
    return await this.notificationsService.sendTestSMS(sms);
  }

  // /**
  //  * Send Demo WhatsApp Message
  //  *
  //  * @return {*}
  //  * @memberof TestNotificationsController
  //  */
  // @Post('test-whatsapp')
  // @UseGuards(AuthenticationGuard)
  // async sendTestWhatsAppMessage(@GenericResponse() res: GenericResponse) {
  //   // Send demo whatsapp message
  //   const response = await this.notificationsService.sendDemoWhatsAppMessage();
  //   // set response status code
  //   res.setStatus(response.statusCode);
  //   // return response
  //   return response;
  // }
}
