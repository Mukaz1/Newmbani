import { CreateRole, PermissionEnum, RolesEnum } from '@newmbani/types';

export const RolePermissions = {
  // permissions a landlord can have in the system by default
  superAdmin: [PermissionEnum.MANAGE_ALL, PermissionEnum.SYNC_DATABASE],
  // permissions an employee can have in the system by default
  employee: [
    PermissionEnum.VIEW_EMPLOYEE,

    PermissionEnum.CREATE_TASK,
    PermissionEnum.UPDATE_TASK,
    PermissionEnum.VIEW_TASK,
    PermissionEnum.VIEW_TASKS,

    PermissionEnum.VIEW_PROPERTIES,
    PermissionEnum.VIEW_BOOKINGS,

    PermissionEnum.VIEW_USER, // View their User Profile
    PermissionEnum.UPDATE_USER, // Update their User Profile

    PermissionEnum.VIEW_EMPLOYEE, // View their Employee Profile
    PermissionEnum.UPDATE_EMPLOYEE, // Update their Employee Profile

    PermissionEnum.VIEW_REQUIRED_DOCUMENT,
    PermissionEnum.VIEW_REQUIRED_DOCUMENTS,
    PermissionEnum.APPROVE_REQUIRED_DOCUMENT,

    PermissionEnum.VIEW_CONTACT,
    PermissionEnum.VIEW_CONTACTS,
  ],
  // permissions a tenant can have in the system by default
  tenant: [
    PermissionEnum.VIEW_BOOKINGS,
    PermissionEnum.VIEW_BOOKING,
    PermissionEnum.CREATE_BOOKING,

    PermissionEnum.VIEW_TENANT,
    PermissionEnum.UPDATE_TENANT,

    PermissionEnum.VIEW_INVOICE,
    PermissionEnum.VIEW_INVOICES,

    PermissionEnum.VIEW_PAYMENT,
    PermissionEnum.VIEW_PAYMENTS,

    PermissionEnum.VIEW_USER, // View their User Profile
    PermissionEnum.UPDATE_USER, // Update their User Profile

    PermissionEnum.UPLOAD_FILES, // they can upload their profile image
  ],
  // permissions a landlord can have in the system by default
  landlord: [
    PermissionEnum.MANAGE_PROPERTIES,

    PermissionEnum.VIEW_BOOKING,
    PermissionEnum.VIEW_BOOKINGS,

    PermissionEnum.VIEW_TENANT,
    PermissionEnum.VIEW_TENANTS,

    PermissionEnum.VIEW_USER,
    PermissionEnum.UPDATE_USER,

    PermissionEnum.VIEW_LANDLORD,
    PermissionEnum.UPDATE_LANDLORD,

    PermissionEnum.UPLOAD_FILES, // they can upload their profile image, required documents, e.t.c

    PermissionEnum.VIEW_REQUIRED_DOCUMENT,
    PermissionEnum.VIEW_REQUIRED_DOCUMENTS,
  ],
};

export const DefaultRolesData: CreateRole[] = [
  {
    name: RolesEnum.SuperAdminRole,
    permissions: RolePermissions.superAdmin,
  },
  {
    name: RolesEnum.LandlordRole,
    permissions: RolePermissions.landlord,
  },
  {
    name: RolesEnum.TenantRole,
    permissions: RolePermissions.tenant,
  },
  {
    name: RolesEnum.Employee,
    permissions: RolePermissions.employee,
  },
];
