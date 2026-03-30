import { rolesEndpoints } from '../admin/pages/roles/utils/roles-endpoints';
import { authEndpoints } from '../auth/utils/auth-endpoints';
import { propertyCategoriesEndpoints } from '../categories/utils/property-categories-endpoints';
import { customersEndpoints } from '../customer/utils/customers.endpoints';
import { landlordsEndpoints } from '../landlords/utils/landlords.endpoints';
import { propertiesEndpoints, propertyImageCategoriesEndpoints, propertyImagesEndpoints } from '../properties/utils/properties.endpoints';
import { employeesEndpoints } from '../users/utils/employees-endpoints';
import { usersEndpoints } from '../users/utils/users-endpoints';

import { APIBaseAPIUrl } from './base-api-url';

export enum RouteConstants {
  UNAUTHORIZED = '/unauthorized',
}

export const fileEndpoints = {
  UPLOAD_FILE: `${APIBaseAPIUrl}/files`,
  UPLOAD_MULTIPLE_FILES: `${APIBaseAPIUrl}/files/multiple`,
  VIEW_FILE: `${APIBaseAPIUrl}/files`,
  DOWNLOAD_FILE: `${APIBaseAPIUrl}/files/download`,
};

const NOTIFICATION_DEMOS = '/api/notification-demos';
const SMS_WEBHOOK = '/api/sms-webhook';

export const notificationEndpoints = {
  SEND_TEST_EMAIL: `${NOTIFICATION_DEMOS}/test-email`,
  SEND_TEST_SMS: `${NOTIFICATION_DEMOS}/test-sms`,
  SMS_WEBHOOK_ONFON: `${SMS_WEBHOOK}/onfon`,
} as const;



export const API_ENDPOINTS = {
  ...authEndpoints,
  ...fileEndpoints,
  ...authEndpoints,
  ...usersEndpoints,
  ...rolesEndpoints,
  ...employeesEndpoints,
  ...landlordsEndpoints,
  ...customersEndpoints,
  ...propertyCategoriesEndpoints,
  ...rolesEndpoints,
  ...employeesEndpoints,
  ...customersEndpoints,
  ...propertyCategoriesEndpoints,
  ...propertiesEndpoints,
  ...notificationEndpoints,
  ...propertyImageCategoriesEndpoints,
  ...propertyImagesEndpoints,

  // Settings
  VIEW_SETTINGS: `${APIBaseAPIUrl}/settings`,
  UPDATE_SETTINGS: `${APIBaseAPIUrl}/settings`,
  UPDATE_GENERAL_SETTINGS: `${APIBaseAPIUrl}/settings/general`,
  UPDATE_BRANDING_SETTINGS: `${APIBaseAPIUrl}/settings/branding`,

  // Sequence
  GET_SEQUENCE: `${APIBaseAPIUrl}/settings/sequence`,
  GET_DASHBOARD_REPORTS: `${APIBaseAPIUrl}/reports`,

  // Regions
  GET_COUNTRIES: `${APIBaseAPIUrl}/countries`,

  // Regions
  GET_CURRENCIES: `${APIBaseAPIUrl}/currencies`,

  // Required Documents
  GET_REQUIRED_DOCUMENTS: `${APIBaseAPIUrl}/required-documents`,
  GET_REQUIRED_DOCUMENT: `${APIBaseAPIUrl}/required-documents`,
  CREATE_REQUIRED_DOCUMENT: `${APIBaseAPIUrl}/required-documents`,
  UPDATE_REQUIRED_DOCUMENT: `${APIBaseAPIUrl}/required-documents`,
  DELETE_REQUIRED_DOCUMENT: `${APIBaseAPIUrl}/required-documents`,
};
