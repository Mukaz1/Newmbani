import { LandlordApprovalStatus } from '../enums/landlord-approval-status.enum';
import { AuditData } from '../../audit';
import { Country } from '../../countries';
import { Address } from '../../addresses';

export interface CreateLandlord {
  name: string;
  displayName: string;
  email: string;
  phone: string;
  address: Address;
  acceptTerms: boolean;
  languages?: string[];
  password: string;
}

export interface PostCreateLandlord extends CreateLandlord {
  approvalStatus: LandlordApprovalStatus;
}

export interface Landlord extends PostCreateLandlord, AuditData {
  country: Country;
}
