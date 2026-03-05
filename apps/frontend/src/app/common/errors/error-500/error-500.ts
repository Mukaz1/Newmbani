import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-error-500',
  imports: [Button],
  templateUrl: './error-500.html',
  styleUrl: './error-500.scss',
})
export class Error500 {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigateByUrl('/');
  }
}
