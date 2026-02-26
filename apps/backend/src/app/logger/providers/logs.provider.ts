import { DatabaseModelEnums } from '@newmbani/types';
import { LogsModel } from '../schemas/logs.schema';
import { AuthLogsModel } from '../schemas/auth-logs.schema';

export const logsProviders = [
  {
    provide: DatabaseModelEnums.LOG,
    useFactory: () => LogsModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.AUTH_LOG,
    useFactory: () => AuthLogsModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
