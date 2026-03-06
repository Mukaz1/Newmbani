import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  DestroyRef,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '@newmbani/types';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerHeader } from './partials/header/header';
import { CustomerSidebar } from './partials/sidebar/sidebar';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CustomerHeader, CustomerSidebar, NgClass],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  user = signal<User | undefined>(undefined);
  userName = computed(() => this.user()?.name);
  isSidebarOpen = false;

  ngOnInit() {
    // Get the logged-in user from local storage
    const user = this.authService.getStoredUser() ?? undefined;
    this.user.set(user);

    // Close sidebar on navigation end for mobile
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (window.innerWidth < 1024) {
          this.isSidebarOpen = false;
        }
      });
  }

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
