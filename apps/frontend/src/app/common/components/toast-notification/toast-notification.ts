import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { Notification } from '@newmbani/types';
import { isPlatformBrowser, NgClass } from '@angular/common';

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.html',
  imports: [NgClass],
  styleUrls: ['./toast-notification.scss'],
})
export class ToastNotification implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  notification: Notification | null = null;
  destroy$ = new Subject();
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  ngOnInit(): void {
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notification: Notification | null) => {
          if (notification) {
            this.notification = notification;
            this.changeDetectorRef.detectChanges();
          }
          this.showNotification();
        },
      });
  }
  showNotification() {
    const toast = this.isBrowser ? document.getElementById('toast') : null;
    if (!toast || !this.notification) {
      return;
    }
    toast.className = `show ${this.notification.status}`;
    setTimeout(() => {
      this.closeNotification();
    }, 5000);
  }

  closeNotification(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const toast = this.isBrowser ? document.getElementById('toast') : null;
    if (!toast) {
      return;
    }
    toast.className = toast.className.replace('show', '');
    toast.className = toast.className.replace(
      `${this.notification?.status}`,
      ''
    );
    this.notification = null;
    this.changeDetectorRef.detectChanges();
  }
}
