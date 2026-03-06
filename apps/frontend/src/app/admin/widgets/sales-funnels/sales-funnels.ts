
import { Component } from '@angular/core';

@Component({
    selector: 'app-sales-funnels',
    imports: [],
    templateUrl: './sales-funnels.html',
    styleUrl: './sales-funnels.scss'
})
export class SalesFunnels {
  salesStages = [
    {
      name: 'All sessions',
      value: '289.12K',
      subtext: 'No shopping activity',
      percentage: '100%',
    },
    {
      name: 'Property views',
      value: '184.64k',
      subtext: 'No cart addition',
      percentage: '75%',
    },
    {
      name: 'Add to cart',
      value: '156.3K',
      subtext: 'Cart abandon',
      percentage: '50%',
    },
    {
      name: 'Checkout',
      value: '65.8K',
      subtext: 'Checkout abandon',
      percentage: '25%',
    },
  ];
}
