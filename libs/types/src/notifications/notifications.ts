export interface Notification {
  title: string;
  message: string;
  status: NotificationStatusEnum
}

export enum NotificationStatusEnum {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}
