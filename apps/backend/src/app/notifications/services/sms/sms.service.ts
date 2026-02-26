import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { take } from 'rxjs';
import { OnfonService } from './onfon.service';
import { HttpStatusCodeEnum } from '@newmbani/types';
import { CustomHttpResponse } from '../../../common';
import { SMSDto } from '../../dto/sms.dto';

@Injectable()
export class SmsService {
  private logger = new Logger(SmsService.name);

  /**
   * Creates an instance of SmsService.
   * @param {HttpService} httpService
   * @memberof SmsService
   */
  constructor(
    private readonly httpService: HttpService,
    private readonly onfonService: OnfonService,
  ) {
    //
  }

  async sendSMSUsingCelcom(sms: SMSDto) {
    const API_KEY = '0e0a65ca1f8a645181b39d350498e0f5';
    const partnerID = '113';
    const message = sms.message;
    const mobile = sms.phone;
    const shortcode = 'TEXTME';

    const payload = `https://isms.celcomafrica.com/api/services/sendsms/?apikey=${API_KEY}&partnerID=${partnerID}&message=${message}&shortcode=${shortcode}&mobile=${mobile}`;
    return this.httpService
      .get(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.OK,
            message: `Message sent to ${mobile} successfully!`,
            data: null,
          });
        },
        error: (err: any) => {
          return new CustomHttpResponse({
            statusCode: HttpStatusCodeEnum.BAD_REQUEST,
            message: `Message sending to ${mobile} failed. Try again!`,
            data: err,
          });
        },
      });
  }

  async sendSMSUsingSMSLEOPARD() {
    try {
      const SMS_SECRET = '8PxjIW2mSn7mwiiPWwiO57eTnxdwjNkuDjwybxwJ';
      const SMS_ACCOUNT_ID = 'OstEvnSAeoO6k2rsDinJ';

      const msg = 'Welcome to Simia Insurance Limited';
      const destination = '0725270930';
      const source = 'SMSLEOPARD';
      // const auth = btoa(`${SMS_ACCOUNT_ID}:${SMS_SECRET}`);

      const account_id = SMS_ACCOUNT_ID;
      const account_secret = SMS_SECRET;

      // const params = {
      //   username: account_id,
      //   password: account_secret,
      //   message: msg,
      //   destination: [
      //     {
      //       number: '0725270930',
      //     },
      //   ],
      //   source,
      // };
      // const account_id = 'your_account_id';
      // const account_secret = 'your_account_secret';
      // const msg = 'Test message';
      // const destination = '254700000001';
      // const source = 'smsleopard';

      const url = `https://api.smsleopard.com/v1/sms/send?username=${account_id}&password=${account_secret}&message=${msg}&destination=${destination}&source=${source}`;

      await fetch(url, {
        method: 'GET',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${account_id}:${account_secret}`).toString('base64'),
        },
      })
        .then((response) => {
          this.logger.log({ response });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((responseText) => {
          this.logger.log(responseText);
        })
        .catch((error) => {
          this.logger.error('Error:', error);
        });
    } catch (error) {
      this.logger.error({ error });
    }
  }

  async sendSMSUsingOnfon() {
    try {
      const msg = 'Welcome to Newmbani';
      const destination = '0725270930';

      return await this.onfonService.sendSMS({
        message: msg,
        destination,
      });
    } catch (error) {
      this.logger.error({ error });
    }
  }
}
