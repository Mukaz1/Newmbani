import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../../settings/services/settings.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  SendEmail,
  Settings,
} from '@newmbani/types';
import { CustomHttpResponse } from '../../common';
import { mailFooterTemplate } from '../emails/partials/mail-footer.template';
import { mailHeaderTemplate } from '../emails/partials/mail-header.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authorize transporter
   *
   * @return {*}  {(Promise<{
   *     transporter: nodemailer.Transporter | undefined;
   *     settings-wrapper: Settings | undefined;
   *   }>)}
   * @memberof MailService
   */
  async authorizeMail(settings: Settings): Promise<{
    transporter: nodemailer.Transporter | undefined;
  }> {
    try {
      // const environment = process.env.NODE_ENV;
      // const isProduction: boolean =
      //   environment && environment.toLowerCase().includes('production')
      //     ? true
      //     : false;
      if (settings && settings.mail) {
        const port = settings.mail.port || 465;
        const transporter = nodemailer.createTransport({
          host: settings.mail.host,
          port,
          secure: true,
          auth: settings.mail.auth,
          tls: {
            //TODO: Disables SSL certificate validation: I should remove it in production
            rejectUnauthorized: false,
          },
        });
        return { transporter };
      }

      return { transporter: undefined };
    } catch (error) {
      this.logger.error(error);
      return { transporter: undefined };
    }
  }

  /**
   * Send Email
   *
   * @param {SendEmail} mail
   * @return {*}
   * @memberof MailService
   */
  async sendEmail(mail: SendEmail): Promise<HttpResponseInterface> {
    try {
      // Get Settings from the database
      const settings: Settings | undefined = (
        await this.settingsService.getSettings({ all: true })
      ).data;
      // get settings-wrapper from db and authorize mail
      const mailService = await this.authorizeMail(settings);

      if (!mailService) {
        this.logger.error('Email Not Authorized');
        return;
      }

      const testMode = this.configService.get('TEST_MODE')
        ? JSON.parse(this.configService.get('TEST_MODE'))
        : true;

      const to = testMode
        ? this.configService.get('TEST_EMAIL')
        : mail.recipient;

      // prepare the template properly adding the header and the footer
      const template = `
  ${mailHeaderTemplate({ title: mail.subject }, settings)}
  ${mail.html.template}
  ${mailFooterTemplate(settings)}
  `;
      // prepare mail options
      const mailOptions = {
        from: `${settings.mail?.from}`,
        to,
        subject: mail.subject,
        html: template,
        attachments: [...(mail.attachments || [])],
      };

      // prepare transporter
      const transporter = mailService.transporter;
      // if no transporter, return
      if (!transporter) return;
      // send mail and log errors
      transporter.sendMail(mailOptions, (error: any, data: any) => {
        if (error) {
          return new CustomHttpResponse({
            statusCode: error.statusCode,
            message: error.message,
            data: error,
          });
        }
        Promise.resolve(data);
        const message = `Email Sent to ${to} Successfully`;
        this.logger.log(message);
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.OK,
          message,
          data,
        });
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'Email Not Sent',
        data: error,
      });
    }
  }
}
