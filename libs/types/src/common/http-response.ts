import { HttpStatusCodeEnum } from "./enums/status-codes.enum";

export interface HttpResponseInterface<T = any> {
  statusCode: HttpStatusCodeEnum;
  message: string;
  data: T;
}
