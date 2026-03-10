import { CdkMenuModule, CdkMenuTrigger, CdkMenu } from '@angular/cdk/menu';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings-wrapper',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CdkMenu,
    CdkMenuModule,
    CdkMenuTrigger,
  ],
  templateUrl: './settings-wrapper.html',
  styleUrl: './settings-wrapper.scss',
})
export class SettingsWrapper {}
