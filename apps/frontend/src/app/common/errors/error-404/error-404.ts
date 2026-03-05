import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-404',
  imports: [Button],
  templateUrl: './error-404.html',
  styleUrl: './error-404.scss',
})
export class Error404 {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  goHome() {
    this.router.navigateByUrl('/');
  }

  goBack() {
    this.location.back();
  }
}
