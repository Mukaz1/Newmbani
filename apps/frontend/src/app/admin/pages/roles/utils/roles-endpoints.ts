import { permissionsEndpoints } from '../../../../auth/utils/permissions-endpoints';
import { APIBaseAPIUrl } from '../../../../common/base-api-url';

export const rolesEndpoints = {
  CREATE_ROLE: `${APIBaseAPIUrl}/roles`,
  GET_ROLE: `${APIBaseAPIUrl}/roles`,
  GET_ROLES: `${APIBaseAPIUrl}/roles`,
  GET_USERS_WITH_ROLE: `${APIBaseAPIUrl}/users/role`,
  UPDATE_ROLE: `${APIBaseAPIUrl}/roles`,
  DELETE_ROLE: `${APIBaseAPIUrl}/roles`,
  ...permissionsEndpoints,
};
