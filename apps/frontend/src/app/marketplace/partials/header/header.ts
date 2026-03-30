// file: src/app/layout/header/header.ts
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Router,
  NavigationEnd,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Button } from '../../../common/components/button/button';
import { UserProfileWidget } from '../../components/user-profile-widget/user-profile-widget';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    Button,
    UserProfileWidget,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit {
  mobileMenuOpen = signal(false);
  userType = signal({ admin: false, landlord: false, customer: false });
  isLoggedIn = signal(false);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.mobileMenuOpen.set(false);
        this.scrollToTop();
      }
    });
  }

  ngOnInit(): void {
    this.userType.set(this.authService.getUserType());
    this.isLoggedIn.set(this.authService.isAuthenticated());
  }

  onBecomeHost() {
    this.router.navigate(['auth/register/host']);
  }
  gotoDashboard() {
    this.router.navigate(['/portal-index']);
  }

  logout() {
    return this.authService.logout();
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  // helpers for mobile dropdown
  toggleMobileMenu() {
    // if the mobile dropdown exists, close it
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }
}
