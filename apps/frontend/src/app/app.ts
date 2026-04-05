import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { ToastNotification } from './common/components/toast-notification/toast-notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastNotification],
  template: `<div class="w-full h-full">
    <router-outlet />
    <div class=" z-50">
      <app-toast-notification />
    </div>
  </div>`,
})
export class App implements OnInit {
  title = 'Newmbani';
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.getStoredUser();
  }
}
