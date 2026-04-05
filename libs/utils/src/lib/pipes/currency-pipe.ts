// import { Currency } from '@newmbani/types';

// export class CurrencyPipe {
//   private locale = 'en-US';
//   constructor(private currency: Currency) {
//     this.locale =
//       this.currency.code === 'KES'
//         ? 'en-KE'
//         : this.currency.code === 'UGX'
//           ? 'en-UG'
//           : 'en-US';
//   }

//   transform(
//     value: number | string,
//     showSymbol = true,
//     fractionDigits = 2,
//   ): string {
//     const amount = typeof value === 'string' ? parseFloat(value) : value;

//     if (isNaN(amount)) return '';

//     return new Intl.NumberFormat(this.locale, {
//       style: 'currency',
//       currency: this.currency.code,
//       minimumFractionDigits: fractionDigits,
//       maximumFractionDigits: fractionDigits,
//       currencyDisplay: showSymbol ? 'symbol' : 'code',
//     }).format(amount);
//   }
// }
