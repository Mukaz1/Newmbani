import { Address } from "../../addresses"
import { Country } from "../../countries"
import { Landlord } from "../../landlords"
import { PropertyCategory } from "../categories"
import { PropertyApprovalStatus } from "../enums/property-approval-status.enum"
import { PropertyType } from "../enums/property-type"

export interface CreateProperty {
    landlordId: string
    categoryId: string
    title: string
    dscription:string
    rentPrice: number
    deposit: number
    isAvailable: boolean
    availableUnits: number
    propertyType: PropertyType
    address:Address
}

export interface PostCreateProperty {
    images:string[]
    approvalStatus: PropertyApprovalStatus
}

export interface Property {
    category: PropertyCategory;
    landlord: Landlord;
    country:Country
}