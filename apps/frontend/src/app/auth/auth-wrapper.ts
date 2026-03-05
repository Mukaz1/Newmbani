import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-auth-wrapper',
  imports: [RouterOutlet],
  templateUrl: './auth-wrapper.html',
  styleUrl: './auth-wrapper.scss',
})
export class AuthWrapper {
  private readonly router = inject(Router);
  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // NavigationEnd event observed; logic can be added here if needed in the future
      });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
