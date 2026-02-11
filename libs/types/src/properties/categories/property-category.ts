import { AuditData } from "../../audit";


export interface CreatePropertyCategory{
    name:string;
    description: string;
}

export interface PropertyCategory extends CreatePropertyCategory, AuditData{
}