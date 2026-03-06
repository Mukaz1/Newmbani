import { APIBaseAPIUrl } from '../../common/base-api-url';

export const hostsEndpoints = {
  ALL_HOSTS: `${APIBaseAPIUrl}/hosts`,
  CREATE_HOST: `${APIBaseAPIUrl}/hosts`,
  VIEW_HOST: `${APIBaseAPIUrl}/hosts`,
  UPDATE_HOST: `${APIBaseAPIUrl}/hosts`,
  DELETE_HOST: `${APIBaseAPIUrl}/hosts`,
  HOST_LOGS: `${APIBaseAPIUrl}/account/host-logs`,
  APPROVE_HOST: `${APIBaseAPIUrl}/hosts`,
  GET_HOSTS_FROM_STORE: `${APIBaseAPIUrl}/hosts`,
  GET_HOST_PROFILE_FROM_STORE: `${APIBaseAPIUrl}/hosts`,
};

export const hostsDocumentEndpoints = {
  GET_HOST_DOCUMENTS: `${APIBaseAPIUrl}/host-documents`,
  CREATE_HOST_DOCUMENT: `${APIBaseAPIUrl}/host-documents`,
  RESUBMIT_HOST_DOCUMENT: `${APIBaseAPIUrl}/host-documents`,
};
