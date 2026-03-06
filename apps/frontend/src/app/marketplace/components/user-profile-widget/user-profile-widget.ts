import { AfterViewInit, Component, inject, Input, signal } from '@angular/core';
import { CdkMenuModule } from '@angular/cdk/menu';
import { Router, RouterLink } from '@angular/router';
import { User } from '@newmbani/types';
import { AuthService } from '../../../auth/services/auth.service';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmDialog } from '../../../common/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-profile-widget',
  imports: [CdkMenuModule, RouterLink],
  templateUrl: './user-profile-widget.html',
  styleUrl: './user-profile-widget.scss',
})
export class UserProfileWidget implements AfterViewInit {
  @Input({ required: true }) forBackend = false;
  @Input({ required: true }) theme: 'dark' | 'light' = 'dark';
  dialog = inject(Dialog);
  private readonly authService = inject(AuthService);
  user = signal<User | null>(null);
  private readonly router = inject(Router);

  logout() {
    this.openLogoutConfirmDialog();
  }

  ngAfterViewInit(): void {
    this.user.set(this.authService.user());
  }

  openLogoutConfirmDialog() {
    const modalRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        confirmButtonIcon: 'bi bi-box-arrow-right',
        cancelButtonIcon: 'bi bi-x-circle',
        confirmButtonStyle:
          'bg-red-500 !outline-none text-white !border-0 hover:bg-red-600',
        cancelButtonStyle:
          'bg-primary-500 !outline-none text-white !border-0 hover:bg-primary-800',
      },
    });
    modalRef.closed.subscribe(async (result: any) => {
      if (result) {
        await this.authService.logout(false, false);
        this.user.set(this.authService.user());
        this.router.navigate(['/']);
      }
    });
  }
}
