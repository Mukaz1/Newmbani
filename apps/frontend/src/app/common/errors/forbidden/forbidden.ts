import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Button } from '../../components/button/button';
import { Settings } from '@newmbani/types';
import { SettingsService } from '../../../settings/services/settings.service';

@Component({
  selector: 'app-forbidden',
  imports: [Button],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.scss',
})
export class Forbidden implements OnInit {
  private readonly router = inject(Router);
  location = inject(Location);
  private readonly settingsService = inject(SettingsService);

  settings = signal<Settings | null>(null);

  ngOnInit(): void {
    this.settings.set(this.settingsService.settings())
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

  goBack() {
    this.location.back();
  }
}