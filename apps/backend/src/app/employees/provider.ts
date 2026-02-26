import { DatabaseModelEnums } from '@newmbani/types';
import { EmployeeModel } from './schemas/employee.schema';

export const employeeProviders = [
  {
    provide: DatabaseModelEnums.EMPLOYEE,
    useFactory: () => EmployeeModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
