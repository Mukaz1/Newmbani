// import { Currency } from '@newmbani/types';

// export function ConvertToBaseCurrency(data: {
//   baseCurrency: Currency;
//   currencies: Currency[];
//   amount: number;
//   currencyId: string;
// }): {
//   currencyId: string;
//   amount: number;
//   rate: number;
// } {
//   const { baseCurrency, currencies, currencyId } = data;
//   const currency: Currency | undefined = currencies.find(
//     (cur) => cur._id.toString() === currencyId.toString(),
//   );
//   if (!currency) {
//     return {
//       amount: data.amount,
//       rate: baseCurrency.rateAgainstBaseCurrency,
//       currencyId: baseCurrency._id.toString(),
//     };
//   }
//   const rate = currency.rateAgainstBaseCurrency ?? 1;
//   const amount = data.amount / rate;

//   return {
//     currencyId: baseCurrency._id.toString(),
//     amount,
//     rate,
//   };
// }
