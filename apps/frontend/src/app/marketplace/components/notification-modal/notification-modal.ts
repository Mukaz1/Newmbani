import { Component, Input, Output, EventEmitter } from '@angular/core';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-notification-modal',
  imports: [],
  templateUrl: './notification-modal.html',
  styleUrl: './notification-modal.scss',
})
export class NotificationModal {
  @Input() show = false;
  @Input() type: NotificationType = 'info';
  @Input() message = '';
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';

  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get iconClass() {
    switch (this.type) {
      case 'success':
        return 'bi bi-check-circle-fill text-green-500';
      case 'error':
        return 'bi bi-x-circle-fill text-red-500';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill text-yellow-500';
      case 'info':
        return 'bi bi-info-circle-fill text-blue-500';
      default:
        return 'bi bi-info-circle-fill text-blue-500';
    }
  }

  get borderClass() {
    switch (this.type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-yellow-500';
      case 'info':
        return 'border-blue-500';
      default:
        return 'border-blue-500';
    }
  }

  get bgClass() {
    switch (this.type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
        return 'bg-blue-50';
      default:
        return 'bg-blue-50';
    }
  }
}
