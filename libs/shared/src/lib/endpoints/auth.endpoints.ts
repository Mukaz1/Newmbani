const AUTH_BASE = '/api/auth';
const AUTH_REGISTER_BASE = '/api/auth/register';
const AUTH_PASSWORD_BASE = '/api/auth/password';

export const AUTH_ENDPOINTS = {
  SIGN_IN: `${AUTH_BASE}/sign-in`,
  REFRESH_TOKEN: `${AUTH_BASE}/refresh-token`,
  LOGOUT: `${AUTH_BASE}/logout`,

  REGISTER_LANDLORD: `${AUTH_REGISTER_BASE}/landlord`,
  REGISTER_CUSTOMER: `${AUTH_REGISTER_BASE}/customer`,

  PASSWORD_RESET_REQUEST: `${AUTH_PASSWORD_BASE}/reset`,
  PASSWORD_RESET_VERIFY: `${AUTH_PASSWORD_BASE}/reset/verify`,
  PASSWORD_RESET_CONFIRM: `${AUTH_PASSWORD_BASE}/reset/confirm`,
  PASSWORD_UPDATE_LOGGED_IN: `${AUTH_PASSWORD_BASE}/update`,
} as const;

