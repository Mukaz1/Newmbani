import { Role } from '../../authorization';

export interface RegisterEmployee {
  name: string;
  email: string;
  password: string;
  phone: string;
  roleId: string;
}
export interface PostNewEmployee extends Omit<RegisterEmployee, 'password'> {
  createdBy: string;
}

export interface UpdateEmployee {
  roleId?: string;
  name: string;
  email: string;
  phone: string;
}

export interface Employee extends RegisterEmployee {
  _id: string;
  createdBy: string;
  isActive: boolean;
  role: Role;
  updatedBy?: string;
  deletedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
