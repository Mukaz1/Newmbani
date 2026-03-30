import { Address } from '../../addresses';
import { AuditData } from '../../audit';
import { Booking } from '../../bookings';
import { Country } from '../../countries';
import { Landlord } from '../../landlords';
import { PropertyApprovalStatus } from '../enums/property-approval-status.enum';
import { PropertyElectricityEnum, PropertyType, PropertyWaterEnum } from '../enums/property-type';
import { PropertyCategory } from './property-category';
import { PropertyImage } from './property-images';

export interface CreateProperty {
  landlordId: string;
  categoryId: string;
  subcategoryId: string;
  title: string;
  description: string;
  rentPrice: number;
  deposit: number;
  isAvailable: boolean;
  availableUnits: number;
  address: Address;
  map: Coordinates;
  features: PropertyFeatures;
}

export interface PostCreateProperty extends CreateProperty {
  images?: PropertyImage[];
  approvalStatus: PropertyApprovalStatus;
  slug: string;
}

export interface Property extends PostCreateProperty, AuditData {
  category: PropertyCategory;
  landlord: Landlord;
  country: Country;
  bookings: Booking[];
  isFavorite: boolean
}

export interface Coordinates {
  lat: number;
  lng: number;
}


export interface PropertyFeatures {
  electricity: PropertyElectricityEnum;
  water: PropertyWaterEnum;
  security: string;
}
