import { Address } from "cluster";
import { LandlordApprovalStatus } from "../enums/landlord-approval-status.rnum";
import { AuditData } from "../../audit";
import { Country } from "../../countries";

export interface CreateLandlord {
    name:string;
    email:string;
    phone:string;
    address: Address
}

export interface PostCreateLandlord {
    approvalStatus: LandlordApprovalStatus
}

export interface Landlord extends PostCreateLandlord, AuditData {
    country: Country
}