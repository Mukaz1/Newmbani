import { AuditData } from '../../common/audit-data';
import { Country } from '../../countries';
import { Landlord } from '../index';
import { LandlordDocumentStatus } from './enums/landlord-document-status.enum';

export interface CreateLandlordDocument {
  landlordId?: string;
  documentId: string;
  comment?:string;
  expiryDate: Date | string;
}

export interface PostCreateLandlordDocument extends CreateLandlordDocument {
  fileId?: string;
  verified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Date | string;
  status: LandlordDocumentStatus;
}

export interface LandlordDocument extends PostCreateLandlordDocument, AuditData {
  landlord: Landlord;
  document: RequiredDocument;
}

export interface CreateRequiredDocument {
  name: string;
  countryId: string;
  isMandatory: boolean;
  isServiceProvider: boolean;
  isPropertyLandlord: boolean;
}


export interface RequiredDocument extends CreateRequiredDocument, AuditData {
  country: Country;
}
