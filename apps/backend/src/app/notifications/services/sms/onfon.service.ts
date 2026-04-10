import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnfonService {
  baseURL = process.env.ONFON_BASE_URL;
  apiUsername = process.env.ONFON_API_USERNAME;
  apiPassword = process.env.ONFON_API_PASSWORD;
  AccessToken = process.env.ONFON_ACCESS_TOKEN;
  clientId = process.env.ONFON_CLIENT_ID;
  callback = process.env.ONFON_CALLBACK_URL;

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
