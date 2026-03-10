import { AuditData } from '../../common/audit-data';
import { PropertyCategory } from './property-category';

export interface CreatePropertiesSubCategory {
  categoryId: string;
  name: string;
  description: string;
  icon?: string;
}

export interface PostPropertiesSubCategory extends CreatePropertiesSubCategory {
  slug: string;
  createdBy: string;
}

export type UpdatePropertiesSubCategory = Partial<PostPropertiesSubCategory>;

export interface PropertiesSubCategory
  extends PostPropertiesSubCategory,
    AuditData {
  propertyCategory?: PropertyCategory;
}
