import { AuditData } from "../audit";

export interface CreateUser {
    name: string;
}

export interface User extends CreateUser, AuditData {
    
}