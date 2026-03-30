import {
  NotificationSubScriptions,
  NotificationTypeEnum,
} from '@newmbani/types';

export const DefaultNotificationSubscriptions: NotificationSubScriptions[] = [
  {
    notification: NotificationTypeEnum.INVOICES,
    channels: {
      sms: false,
      email: true,
      whatsapp: false,
    },
  },
  {
    notification: NotificationTypeEnum.RECEIPTS,
    channels: {
      sms: false,
      email: true,
      whatsapp: false,
    },
  },
  {
    notification: NotificationTypeEnum.TASKS,
    channels: {
      sms: true,
      email: true,
      whatsapp: true,
    },
  },
];
