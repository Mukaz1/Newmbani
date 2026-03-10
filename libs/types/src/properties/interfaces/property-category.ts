import { AuditData } from "../../audit";
import { CreatePropertiesSubCategory, PropertiesSubCategory } from "./property-subcategory";


export interface CreatePropertyCategory{
    name:string;
    description: string;
    icon?: string;
    subCategories?: Omit<CreatePropertiesSubCategory, 'categoryId'>[];

}

export interface PostPropertyCategory extends CreatePropertyCategory {
    slug: string;
    createdBy: string;
  }
  
  export interface PropertyCategory
  extends Omit<PostPropertyCategory, 'subCategories'>,
    AuditData {
  subCategories: PropertiesSubCategory[];
}