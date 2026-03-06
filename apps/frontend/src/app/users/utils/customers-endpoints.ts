import { APIBaseAPIUrl } from "../../common/base-api-url";


export const customersEndpoints = {
  CREATE_CUSTOMER: `${APIBaseAPIUrl}/customers`,
  VIEW_CUSTOMER: `${APIBaseAPIUrl}/customers`,
  UPDATE_CUSTOMER: `${APIBaseAPIUrl}/customers`,
  DELETE_CUSTOMER: `${APIBaseAPIUrl}/customers`,
  ALL_CUSTOMERS: `${APIBaseAPIUrl}/customers`,
  CUSTOMER_BY_PHONE: `${APIBaseAPIUrl}/customers/phone`,
  CUSTOMER_ONBOARDING: `${APIBaseAPIUrl}/auth/register/customer`,
};