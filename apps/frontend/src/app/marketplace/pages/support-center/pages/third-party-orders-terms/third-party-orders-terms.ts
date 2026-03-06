import { Component, inject } from '@angular/core';
import { MetaService } from '../../../../../common/services/meta.service';

@Component({
  selector: 'app-third-party-orders-terms',
  imports: [],
  templateUrl: './third-party-orders-terms.html',
  styleUrl: './third-party-orders-terms.scss',
})
export class ThirdPartyOrdersTerms {
  private metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Third Party Orders Terms',
            isClickable: false,
          },
        ],
      },
      title: 'Third Party Orders Terms',
      description: 'Third Party Orders Terms',
    });
  }
}
