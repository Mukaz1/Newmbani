import { APIBaseAPIUrl } from '../../common/base-api-url';

/**
 * Object containing authentication-related API endpoints.
 * These endpoints are used for various authentication and user management operations.
 */
export const authEndpoints = {
  LOGIN: `${APIBaseAPIUrl}/auth/sign-in`,
  REFRESH_TOKEN: `${APIBaseAPIUrl}/auth/refresh-token`,
  MAGIC_LOGIN: `${APIBaseAPIUrl}/auth/magic-login`,
  MAGIC_LOGIN_CALLBACK: `${APIBaseAPIUrl}/auth/magic-login/callback`,
  LOGOUT: `${APIBaseAPIUrl}/auth/logout`,
  ACCOUNT: `${APIBaseAPIUrl}/account`,
  ACCOUNT_PROFILE_IMAGE: `${APIBaseAPIUrl}/account/image`,
  RESET_PASSWORD: `${APIBaseAPIUrl}/auth/password/reset`,
  VERIFY_PASSWORD_RESET_TOKEN: `${APIBaseAPIUrl}/auth/password/reset/verify`,
  CONFIRM_PASSWORD_RESET: `${APIBaseAPIUrl}/auth/password/reset/confirm`,
  UPDATE_PASSWORD: `${APIBaseAPIUrl}/auth/password/update`,
  HOST_ONBOARDING: `${APIBaseAPIUrl}/auth/register/host`,
  CUSTOMER_ONBOARDING: `${APIBaseAPIUrl}/auth/register/customer`,
  AUTH_LOGS: `${APIBaseAPIUrl}/account/auth-logs`,
};
