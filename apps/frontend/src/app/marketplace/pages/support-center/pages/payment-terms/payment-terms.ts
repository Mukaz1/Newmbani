import { Component, inject } from '@angular/core';
import { MetaService } from '../../../../../common/services/meta.service';

@Component({
  selector: 'app-payment-terms',
  imports: [],
  templateUrl: './payment-terms.html',
  styleUrl: './payment-terms.scss',
})
export class PaymentTerms {
  private metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Payment Terms',
            isClickable: false,
          },
        ],
      },
      title: 'Payment Terms',
      description: 'Payment Terms',
    });
  }
}
