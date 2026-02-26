import { HttpResponseInterface, HttpStatusCodeEnum } from '@newmbani/types';
import { appVersion } from '@newmbani/shared';

export class CustomHttpResponse<T = any> {
  statusCode: HttpStatusCodeEnum;
  message: string;
  data: T;
  appVersion: string;

  /**
   * Creates an instance of HttpResponseInterface.
   * @memberof HttpResponseInterface
   * @param httpResponse
   */
  constructor(httpResponse: HttpResponseInterface) {
    const { statusCode, message, data } = httpResponse;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.appVersion = `v${appVersion}`;
  }
}
