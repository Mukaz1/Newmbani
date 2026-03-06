import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { User } from '@newmbani/types';
import { filter } from 'rxjs';
import { NgClass } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/services/auth.service';
import { ConfirmDialog } from '../common/components/confirm-dialog/confirm-dialog';
import { CurrencyWidget } from '../common/components/currency-widget/currency-widget';
import { getGreeting } from '../common/helpers/greetings.helper';
import { UserProfileWidget } from '../marketplace/components/user-profile-widget/user-profile-widget';
import { Footer } from './partials/footer/footer';
import { AdminSidebar } from './partials/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-wrapper',
  imports: [
    RouterModule,
    Footer,
    AdminSidebar,
    NgClass,
    CurrencyWidget,
    UserProfileWidget,
  ],
  templateUrl: './dashboard-wrapper.html',
  styleUrl: './dashboard-wrapper.scss',
})
export class DashboardWrapper implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);
  user: User | null = null;
  greeting = getGreeting();
  constructor() {
    // get the logged-in user from local storage
    this.user = this.authService.user();
    // Close sidebar on navigation end for mobile
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth < 1024) {
          this.isSidebarOpen = false;
        }
      });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // close sidebar
        this.closeSidebar();
      });
  }
  // get the logged-in user from local storage
  isSidebarOpen = false;

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Logout',
        message: 'Are you sure you want to logout?',
      },
    });
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: any) => {
        if (result as boolean) {
          this.authService.logout(false);
          this.router.navigate(['/auth/login']);
        }
      });
  }
}
