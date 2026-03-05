import { APIBaseAPIUrl } from '../../common/base-api-url';

export const permissionsEndpoints = {
  CREATE_PERMISSION: `${APIBaseAPIUrl}/authorization/permissions`,
  GET_PERMISSION: `${APIBaseAPIUrl}/authorization/permissions`,
  GET_PERMISSIONS: `${APIBaseAPIUrl}/authorization/permissions`,
  GET_USERS_WITH_PERMISSION: `${APIBaseAPIUrl}/users/permission`,
  UPDATE_PERMISSION: `${APIBaseAPIUrl}/authorization/permissions`,
  DELETE_PERMISSION: `${APIBaseAPIUrl}/authorization/permissions`,
};
