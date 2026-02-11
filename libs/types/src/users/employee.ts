import { AuditData } from "../audit";
import { Role } from "../auth";

export interface RegisterEmployee {
  name: string;
  email: string;
  password: string;
  phone: string;
  roleId: string;
}
export interface PostNewEmployee extends Omit<RegisterEmployee, 'password'>{
  createdBy: string;
}
export interface UpdateEmployee {
  roleId?: string;
  name: string;
  email: string;
  phone: string;
}

export interface Employee extends AuditData, UpdateEmployee{
  role?: Role;
}
