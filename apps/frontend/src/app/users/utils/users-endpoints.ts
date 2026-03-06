import { APIBaseAPIUrl } from "../../common/base-api-url";


export const usersEndpoints = {
  ALL_USERS: `${APIBaseAPIUrl}/users`,
  CREATE_USER: `${APIBaseAPIUrl}/users`,
  VIEW_USER: `${APIBaseAPIUrl}/users`,
  UPDATE_USER: `${APIBaseAPIUrl}/users`,
  DELETE_USER: `${APIBaseAPIUrl}/users`,
  AUTH_LOGS: `${APIBaseAPIUrl}/account/auth-logs`,
};
