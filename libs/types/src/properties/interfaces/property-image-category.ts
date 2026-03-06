import { AuditData } from '../../common/audit-data';
import { PropertyImage } from './property-images';

export interface CreatePropertyImageCategory {
  name: string;
  minNumber: number;
  maxNumber: number;
  maxFileSize?: number;
}

export interface PostPropertyImageCategory extends CreatePropertyImageCategory {
  createdBy: string;
}

export type UpdatePropertyImageCategory = Partial<PostPropertyImageCategory>;

export interface PropertyImageCategory
  extends PostPropertyImageCategory,
    AuditData {
  propertyImages: PropertyImage[];
}
