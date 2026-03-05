import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '@newmbani/types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notification = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notification.asObservable();

  notify(notification: Notification): void {
    this.notification.next(notification);
    return;
  }
}
