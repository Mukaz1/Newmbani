const NOTIFICATION_DEMOS = '/api/notification-demos';
const SMS_WEBHOOK = '/api/sms-webhook';

export const NOTIFICATIONS_ENDPOINTS = {
  SEND_TEST_EMAIL: `${NOTIFICATION_DEMOS}/test-email`,
  SEND_TEST_SMS: `${NOTIFICATION_DEMOS}/test-sms`,
  SMS_WEBHOOK_ONFON: `${SMS_WEBHOOK}/onfon`,
} as const;

