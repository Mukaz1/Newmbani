import { Address } from '../../addresses';
import { Country } from '../../countries';
import { Landlord } from '../../landlords';
import { PropertyApprovalStatus } from '../enums/property-approval-status.enum';
import { PropertyType } from '../enums/property-type';
import { PropertyCategory } from './property-category';
import { PropertyImage } from './property-images';

export interface CreateProperty {
  landlordId: string;
  categoryId: string;
  title: string;
  description: string;
  rentPrice: number;
  deposit: number;
  isAvailable: boolean;
  availableUnits: number;
  propertyType: PropertyType;
  address: Address;
}

export interface PostCreateProperty extends CreateProperty {
  images?: PropertyImage[];
  approvalStatus: PropertyApprovalStatus;
  slug: string;
}

export interface Property extends PostCreateProperty {
  category: PropertyCategory;
  landlord: Landlord;
  country: Country;
}
