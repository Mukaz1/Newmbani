// import { CurrencyService } from '../services/currency.service';
// import { inject, Pipe, PipeTransform } from '@angular/core';
// import { Currency } from '@newmbani/types';

// @Pipe({
//   name: 'price',
//   pure: false, 
// })
// export class PricePipe implements PipeTransform {
//   private readonly currencyService = inject(CurrencyService);

//   transform(price: number, currencyId?: string): string {
//     if (!currencyId) return this.format(price);

//     const supportedCurrencies = this.currencyService.currencies;
//     const initialCurrency = supportedCurrencies.find(c => c._id === currencyId);
//     const currency: Currency | undefined = this.currencyService.currency();

//     if (!currency || !initialCurrency) {
//       return this.format(price);
//     }

//     const amount = initialCurrency.isBaseCurrency
//       ? price
//       : price / (initialCurrency.rateAgainstBaseCurrency || 1);

//     const converted = currency.isBaseCurrency
//       ? amount
//       : amount * (currency.rateAgainstBaseCurrency || 1);

//     return this.format(converted, currency.code);
//   }

//   private format(amount: number, code = 'USD'): string {
//     return new Intl.NumberFormat('en-KE', {
//       style: 'currency',
//       currency: code,
//       minimumFractionDigits: 2,
//     }).format(amount);
//   }
// }
