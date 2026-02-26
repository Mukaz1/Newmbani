import { CountryModel } from '../schemas/countries.schema';
import { DatabaseModelEnums } from '@newmbani/types';

export const countryProviders = [
  {
    provide: DatabaseModelEnums.COUNTRY,
    useFactory: () => CountryModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
