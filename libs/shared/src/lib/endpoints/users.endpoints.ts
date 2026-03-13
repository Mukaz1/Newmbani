const USERS = '/api/users';

export const UsersEndpoints = {
  GET_USERS: USERS,
  GET_USERS_BY_ROLE: (roleId: string) => `${USERS}/role/${roleId}`,
  GET_USER: (id: string) => `${USERS}/${id}`,
  UPDATE_USER: (id: string) => `${USERS}/${id}`,
} as const;

