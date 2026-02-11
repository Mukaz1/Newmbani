import { Address } from "../addresses";
import { AuditData } from "../audit";

export interface CreateTenant {
    name: string;
    email: string;
    phone: string;
    address: Address
}

export interface Tenant extends CreateTenant, AuditData{}