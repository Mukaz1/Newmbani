// import { CurrencyService } from '../../services/currency.service';
// import { Component, inject, Input, OnInit, signal } from '@angular/core';
// import { Currency } from '@newmbani/types';
// import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
// import { NgClass } from '@angular/common';

// @Component({
//   selector: 'app-currency-widget',
//   imports: [CdkMenuItem, CdkMenu, CdkMenuTrigger, NgClass],
//   templateUrl: './currency-widget.html',
//   styleUrl: './currency-widget.scss',
// })
// export class CurrencyWidget implements OnInit {
//   private readonly currencyService = inject(CurrencyService);

//   @Input() styles = '';
//   currencies = signal<Currency[]>([]);
//   currency = signal<Currency | undefined>(undefined);

//   /**
//    * Creates an instance of CurrencyWidget.
//    * @memberof CurrencyWidget
//    */
//   async ngOnInit(): Promise<void> {
//     this.currencies.set(this.currencyService.currencies);
//     this.currency.set(this.currencyService.getCurrency());
//   }

//   switchCurrency(currency: Currency) {
//     this.currencyService.updateCurrency(currency.code);
//     this.currency.set(currency);
//   }
// }
