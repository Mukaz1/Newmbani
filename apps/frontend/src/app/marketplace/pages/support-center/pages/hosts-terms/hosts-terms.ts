import { Component, inject } from '@angular/core';
import { MetaService } from '../../../../../common/services/meta.service';

@Component({
  selector: 'app-hosts-terms',
  imports: [],
  templateUrl: './hosts-terms.html',
  styleUrl: './hosts-terms.scss',
})
export class HostsTerms {
  private metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Vendor Terms',
            isClickable: false,
          },
        ],
      },
      title: 'Vendor Terms',
      description: 'Vendor Terms',
    });
  }
}
