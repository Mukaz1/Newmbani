import { AuditData } from "../../audit";
import { User } from "../../users";
import { Permission } from "./permission";

export interface CreateRole {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRole {
  permissions: string[];
  name?: string;
  description?: string;
}

export interface PostRole extends CreateRole {
  createdBy: string;
  systemRole: boolean;
}

export interface Role extends PostRole, AuditData {
  permissionDocs: Permission[];
  users: User[];
}
