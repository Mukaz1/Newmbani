import { AuditData } from "../../audit";
import { CreatePropertySubCategory, PropertySubCategory } from "./property-subcategory";


export interface CreatePropertyCategory{
    name:string;
    description: string;
    icon?: string;
    subCategories?: Omit<CreatePropertySubCategory, 'categoryId'>[];

}
export type UpdatePropertyCategory = Partial<CreatePropertyCategory>

export interface PostPropertyCategory extends CreatePropertyCategory {
    slug: string;
    createdBy: string;
  }
  
  export interface PropertyCategory
  extends Omit<PostPropertyCategory, 'subCategories'>,
    AuditData {
  subCategories: PropertySubCategory[];
}