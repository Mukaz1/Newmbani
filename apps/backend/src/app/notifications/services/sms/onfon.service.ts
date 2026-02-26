import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnfonService {
  baseURL = 'https://apis.onfonmedia.co.ke/v1';
  apiUsername = 'briankoech650@gmail.com';
  apiPassword = 'Lc3128$%^&';
  AccessToken = '9H8Ved1lgoX4KiE3Qj6BDtMcUTGwFP7vhmYxR5WfS02ArLzN';
  clientId = 'bdcomputing';
  callback =
    'https://2bc0-2a09-bac1-3b80-8-00-2c0-3e.ngrok-free.app/api/sms-webhook/onfon';

  /**
   * Creates an instance of OnfonService.
   * @param {HttpService} httpService
   * @memberof OnfonService
   */
  constructor(private readonly httpService: HttpService) {}

  async authenticate() {
    try {
      const endpoint = `${this.baseURL}/authorization`;

      const { data } = await this.httpService.axiosRef.post(
        endpoint,
        JSON.stringify({
          apiUsername: this.clientId,
          apiPassword: this.AccessToken,
        }),
        {
          headers: {
            Authorization: `Bearer ${this.AccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const { token } = data;
      return token;
    } catch (error) {
      return null;
    }
  }

  async sendSMS(req: { message: string; destination: string }) {
    try {
      const endpoint = `${this.baseURL}/v2_send`;
      const AccessToken: string = await this.authenticate();

      const payload: any = {
        to: req.destination,
        from: 'sender-id',
        content: req.message,
        dlr: 'yes',
        'dlr-url': this.callback,
        'dlr-level': 1,
      };

      const { data } = await this.httpService.axiosRef.post(
        endpoint,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${AccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      return null;
    }
  }
}
