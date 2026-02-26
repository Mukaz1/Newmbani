import { Injectable, Logger } from '@nestjs/common';
import { SMSDto } from '../dto/sms.dto';
import { SmsService } from './sms/sms.service';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  SendEmail,
  Settings,
  SMS_PROVIDERS_ENUM,
} from '@newmbani/types';
import { SettingsService } from '../../settings/services/settings.service';
import { CustomHttpResponse } from '../../common';
import { TestEmailTemplate } from '../emails/test/test-mail.template';
import { MailService } from './mail.service';

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);

  /**
   * Creates an instance of NotificationsService.
   * @param {SmsService} smsService
   * @param {MailService} mailService
   * @param {SettingsService} settingsService
   * @memberof NotificationsService
   */
  constructor(
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly settingsService: SettingsService,
  ) {}

  /**
   * Send Test Emails
   *
   * @param {string[]} emails
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof NotificationsService
   */
  async sendTestEmails(emails: string[]): Promise<HttpResponseInterface> {
    // Get Settings from database
    const settings: Settings = (
      await this.settingsService.getSettings({ all: true })
    ).data;
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      // Get User
      const mail: SendEmail = {
        html: TestEmailTemplate({ settings, email }),
        recipient: email,
        textAlignment: 'left',
        hasHero: false,
        subject: `Test Email`,
      };
      await this.mailService.sendEmail(mail);
    }
    let message = `Test emails sent to the ${emails.length} email provided`;
    if (emails.length > 1) {
      message = `Test emails sent to the ${emails.length} emails provided`;
    }
    return new CustomHttpResponse({
      statusCode: HttpStatusCodeEnum.OK,
      message,
      data: null,
    });
  }

  /**
   * Dispatch Email
   *
   * @param {SendEmail} mail
   * @return {*}
   * @memberof NotificationsService
   */
  async dispatchEmail(mail: SendEmail): Promise<any> {
    // send email to tenant
    try {
      return await this.mailService.sendEmail(mail);
    } catch (error) {
      this.logger.error({ 'email sending error': error });
      return;
    }
  }

  async sendTestSMS(sms: SMSDto) {
    return await this.sendSMS(sms);
  }

  async sendSMS(sms: SMSDto) {
    const provider = SMS_PROVIDERS_ENUM.ONFON as string;
    if (provider === SMS_PROVIDERS_ENUM.CELCOM) {
      return await this.smsService.sendSMSUsingCelcom(sms);
    } else if (provider === SMS_PROVIDERS_ENUM.ONFON) {
      return await this.smsService.sendSMSUsingOnfon();
    } else if (provider === SMS_PROVIDERS_ENUM.SMS_LEOPARD) {
      return await this.smsService.sendSMSUsingSMSLEOPARD();
    }
  }

  /**
   * Send Demo Whatsapp Message
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof NotificationsService
   */
  // async sendDemoWhatsAppMessage(): Promise<HttpResponseInterface> {
  //   try {
  //     const settings-wrapper: Settings = (
  //       await this.settingsService.getSettings({all:true})
  //     ).data;
  //     const data = this.whatsappService.getTextMessageInput(
  //       settings-wrapper.facebookApp.FACEBOOK_RECIPIENT_WAID,
  //       `Welcome to the ${appName}`,
  //     );
  //     await this.sendWhatsAppMessage(data);
  //     return new CustomHttpResponse(
  //       HttpStatusCodeEnum.OK,
  //       'Message Sent Successfully',
  //       null,
  //     );
  //   } catch (error) {
  //     this.logger.error(error);
  //     return new CustomHttpResponse(
  //       HttpStatusCodeEnum.BAD_REQUEST,
  //       'Message Sending Failed',
  //       error,
  //     );
  //   }
  // }

  /**
   * Send Whatsapp Message
   *
   * @param {*} data
   * @return {*}
   * @memberof NotificationsService
   */
  // async sendWhatsAppMessage(data: any) {
  //   try {
  //     const settings-wrapper: Settings = await (
  //       await this.settingsService.getSettings({all:true})
  //     ).data;
  //     return this.whatsappService.sendMessage(data, settings-wrapper.facebookApp);
  //   } catch (error) {
  //     this.logger.error({ error });
  //     return error;
  //   }
  // }
}
