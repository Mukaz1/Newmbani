import { rolesEndpoints } from '../admin/pages/roles/utils/roles-endpoints';
import { authEndpoints } from '../auth/utils/auth-endpoints';
import { propertyCategoriesEndpoints } from '../categories/utils/property-categories-endpoints';
import { customersEndpoints } from '../users/utils/customers-endpoints';
import { employeesEndpoints } from '../users/utils/employees-endpoints';
import {
  hostsDocumentEndpoints,
  hostsEndpoints,
} from '../users/utils/hosts-endpoints';
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

export const API_ENDPOINTS = {
  ...authEndpoints,
  ...fileEndpoints,
  ...authEndpoints,
  ...usersEndpoints,
  ...rolesEndpoints,
  ...employeesEndpoints,
  ...hostsEndpoints,
  ...hostsDocumentEndpoints,
  ...customersEndpoints,
  ...propertyCategoriesEndpoints,
  ...propertiesEndpoints,
  ...;andlordsEndpoints,
  ...usersEndpoints,
  ...rolesEndpoints,
  ...employeesEndpoints,
  ...hostsEndpoints,
  ...hostsDocumentEndpoints,
  ...customersEndpoints,
  ...propertyCategoriesEndpoints,
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
