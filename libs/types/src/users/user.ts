import { Address } from '../addresses';
import { Role } from '../authorization';
import { FileInterface } from '../files';
import { Landlord } from '../landlords';
import { Customer } from '../customers';
import { Employee } from './employee';

export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  phone: string;
  phoneVerified: boolean;
  magicLogin: boolean;
  verified: boolean;
  password: string;
  isPasswordDefault: boolean;
  landlordId?: string;
  customerId: string | null;
  employeeId?: string;
  twoFactorEnabled: boolean;
  roleId?: string | null;
  fileId?: string | null;
  profileImageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastPasswordChange: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;

  employee: Employee | null;
  defaultAddress: Address;
  landlord: Landlord;
  customer: Customer;
  role: Role | null;
  profileImage?: FileInterface;
}

export interface UpdateUser {
  name: string;
  phone: string;
}
