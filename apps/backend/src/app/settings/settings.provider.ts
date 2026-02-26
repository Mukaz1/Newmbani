import { SettingsModel } from './schemas/settings.schema';
import { DatabaseModelEnums } from '@newmbani/types';

export const settingsProviders = [
  {
    provide: DatabaseModelEnums.SETTING,
    useFactory: () => SettingsModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
