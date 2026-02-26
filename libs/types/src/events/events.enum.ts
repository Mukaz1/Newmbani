import { LandlordEvents } from '../landlords/enums/landlord-events';
import { PropertyEventEnums } from '../properties/enums/events.enums';

enum GeneralEventEnums {
  // System
  SendNewVersionOut = 'SendNewVersionOut',

  Sync = 'Sync',
  SyncDatabase = 'SyncDatabase',
  UpdateSequence = 'UpdateSequence',
  CompanyLogoUploaded = 'CompanyLogoUploaded',
  HostLogoUploaded = 'HostLogoUploaded',
  HostDocumentUploaded = 'HostDocumentUploaded',

  // User Accounts & Hosts
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
};

export type SystemEventsEnum = typeof SystemEventsEnum;
