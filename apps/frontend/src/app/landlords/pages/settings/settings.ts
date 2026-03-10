import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MetaService } from '../../../common/services/meta.service';

@Component({
  selector: 'app-settings',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent {
  private readonly metaService = inject(MetaService);

  constructor() {
    // this.patchQueryParams()
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Landlord Settings',
            isClickable: false,
          },
        ],
      },
      title: 'Landlord Settings',
      description:
        'Manage your landlord profile, password, and notification preferences.',
    });
  }
}
