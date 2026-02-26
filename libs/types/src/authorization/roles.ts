import { AuditData } from '../common/audit-data';
import { User } from '../users';
import { Permission } from './permission';

export interface CreateRole {
  name: string;
  permissions: string[];
  description?: string;
}

export interface UpdateRole {
  permissions: string[];
  name?: string;
  description?: string;
}

export interface Role extends CreateRole, AuditData {
  users: User[];
  permissionDocs: Permission[]
}
