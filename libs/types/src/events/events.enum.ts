import { AuthEventEnums } from '../auth';
import { LandlordEvents } from '../landlords/enums/landlord-events';
import { OTPEventEnums } from '../otp';
import { PropertyEventEnums } from '../properties/enums/events.enums';
import { TenantEventEnums } from '../tenants/enums/events.enums';

enum GeneralEventEnums {
  // System
  SendNewVersionOut = 'SendNewVersionOut',

  Sync = 'Sync',
  SyncDatabase = 'SyncDatabase',
  UpdateSequence = 'UpdateSequence',
  CompanyLogoUploaded = 'CompanyLogoUploaded',
  LandlordLogoUploaded = 'LandlordLogoUploaded',
  LandlordDocumentUploaded = 'LandlordDocumentUploaded',

  // User Accounts & Landlords
  SyncSuperUserAccount = 'SyncSuperUserAccount',
  SuperUserAccountCreated = 'SuperUserAccountCreated',
  UserAccountCreated = 'UserAccountCreated',
  EmployeeAccountCreated = 'EmployeeAccountCreated',

  // Invoice
  InvoiceCreated = 'InvoiceCreated',
  InvoicePDFFileCreated = 'InvoicePDFFileCreated',
  InvoiceUpdated = 'InvoiceUpdated',
  PrepareCommission = 'PrepareCommission',
  InvoicePaid = 'InvoicePaid',

  // File
  FileUploaded = 'FileUploaded',
  ProfileImageUploaded = 'ProfileImageUploaded',

  AddAuthLog = 'AddAuthLog',
  CreateLogEntry = 'CreateLogEntry',
  SEND_INVOICE = 'SEND_INVOICE',

  // Exchange Rate
  ExchangeRateUpdated = 'ExchangeRateUpdated',

  //address
  DefaultAddressSet = 'DefaultAddressSet',
  DefaultAddressRemoved = 'DefaultAddressRemoved',
}

export const SystemEventsEnum = {
  ...GeneralEventEnums,
  ...LandlordEvents,
  ...PropertyEventEnums,
  ...TenantEventEnums,
  ...OTPEventEnums,
  ...AuthEventEnums,
};

export type SystemEventsEnum = typeof SystemEventsEnum;
