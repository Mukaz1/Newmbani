import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MetaService } from '../../../common/services/meta.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent {
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Settings',
            isClickable: false,
          },
        ],
      },
      title: 'Settings',
      description:
        'Fine-tune your account settings, password, notifications, and billing preferences.',
    });
  }
}
