import { AuditData } from '../../common/audit-data';
import { PropertyCategory } from './property-category';

export interface CreatePropertySubCategory {
  categoryId: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface PostPropertySubCategory extends CreatePropertySubCategory {
  slug: string;
  createdBy: string;
}

  export type UpdatePropertySubCategory = Partial<PostPropertySubCategory>;

export interface PropertySubCategory extends PostPropertySubCategory, AuditData {
  category: PropertyCategory;
}
