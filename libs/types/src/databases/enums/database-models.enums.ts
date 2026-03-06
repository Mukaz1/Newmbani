import { AuthorizationDatabaseModelEnums } from '../../authorization';
import { BookingDatabaseModelEnums } from '../../bookings/enums/database-models.enum';
import { CountriesDatabaseModelEnums } from '../../countries';
import { EmployeeDatabaseModelEnums } from '../../employees';
import { LandlordEnums } from '../../landlords/enums/database-model.enum';
import { PropertyEnums } from '../../properties/enums/database-model.enum';
import { CustomerEnums } from '../../customers/enums/database-models.enum';

export enum DatabaseEnums {
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
  BANK = 'banks',
  BANK_ACCOUNT = 'bank_accounts',
  COMPANY_ACCOUNT = 'company_accounts',

  OTP = 'otp_codes',
  COUNTRY = 'countries',

  HOST_DOCUMENT = 'host_documents',
  REQUIRED_DOCUMENT = 'required_documents',

  SETTING = 'settings',
  USER = 'users',
  AUTH_LOG = 'auth_logs',
  HOST = 'hosts',
  CUSTOMER = 'customers',
  SEQUENCE = 'sequence',
  TERMS_AND_CONDITIONS = 'terms_and_conditions',

  // Files
  FILE = 'files',

  // REPORTS
  REPORTS = 'reports',

  // REPORTS
  LOG = 'logs',
}

export const DatabaseModelEnums = {
  ...DatabaseEnums,
  ...PropertyEnums,
  ...LandlordEnums,
  ...CountriesDatabaseModelEnums,
  ...CustomerEnums,
  ...AuthorizationDatabaseModelEnums,
  ...EmployeeDatabaseModelEnums,
  ...BookingDatabaseModelEnums
};
