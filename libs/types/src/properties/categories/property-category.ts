import { AuditData } from "../../audit";


export interface CreatePropertyCategory{
    name:string;
    description: string;
    icon?: string;

}

export interface PostPropertyCategory extends CreatePropertyCategory {
    slug: string;
    createdBy: string;
  }
  

export interface PropertyCategory extends PostPropertyCategory, AuditData{
}