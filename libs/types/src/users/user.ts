import { Address } from "../addresses";
import { AuditData } from "../audit";
import { Role } from "../auth";
import { Landlord } from "../landlords";
import { Tenant } from "../tenants";

export interface CreateUser {
    name: string;
    email: string;
    phone:string;
    password:string;
    roleId: string;
    tenantId?: string;
    landlordId?:string;
    employeeId?: string;
    address?:Address
}
export interface PostCreateUser extends CreateUser{
    profileImageUrl?: string;
}

export interface UpdateUser {
    name: string;
    phone: string;
    address?: Address;
    profileImageUrl?: string;
  }

export interface User extends PostCreateUser, AuditData {
    role: Role
    tenant: Tenant
    landlord:Landlord

}