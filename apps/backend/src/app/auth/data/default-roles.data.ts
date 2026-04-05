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

   
      PermissionEnum.VIEW_BOOKING,
      PermissionEnum.VIEW_BOOKINGS,
      PermissionEnum.UPDATE_BOOKING,
      PermissionEnum.DELETE_BOOKING,
      PermissionEnum.MANAGE_BOOKINGS,
    
      PermissionEnum.VIEW_BOOKING_CANCELLATION,
      PermissionEnum.VIEW_BOOKING_CANCELLATIONS,
      PermissionEnum.MANAGE_BOOKING_CANCELLATIONS,
  ],
  // permissions a customer can have in the system by default
  customer: [
    PermissionEnum.VIEW_BOOKINGS,
    PermissionEnum.VIEW_BOOKING,
    PermissionEnum.CREATE_BOOKING,

    PermissionEnum.VIEW_CUSTOMER,
    PermissionEnum.UPDATE_CUSTOMER,

    PermissionEnum.VIEW_INVOICE,
    PermissionEnum.VIEW_INVOICES,

    PermissionEnum.VIEW_PAYMENT,
    PermissionEnum.VIEW_PAYMENTS,

    PermissionEnum.VIEW_USER, // View their User Profile
    PermissionEnum.UPDATE_USER, // Update their User Profile

    PermissionEnum.UPLOAD_FILES, // they can upload their profile image
    
      PermissionEnum.CREATE_BOOKING,
      PermissionEnum.VIEW_BOOKING,
      PermissionEnum.VIEW_BOOKINGS,
      PermissionEnum.UPDATE_BOOKING,
      PermissionEnum.MANAGE_BOOKINGS,
  
        PermissionEnum.CREATE_BOOKING_CANCELLATION,
      PermissionEnum.VIEW_BOOKING_CANCELLATION,
      PermissionEnum.VIEW_BOOKING_CANCELLATIONS,
      PermissionEnum.MANAGE_BOOKING_CANCELLATIONS,
  
  ],
  // permissions a landlord can have in the system by default
  landlord: [
    PermissionEnum.MANAGE_PROPERTIES,

    PermissionEnum.VIEW_BOOKING,
    PermissionEnum.VIEW_BOOKINGS,

    PermissionEnum.VIEW_CUSTOMER,
    PermissionEnum.VIEW_CUSTOMERS,

    PermissionEnum.VIEW_USER,
    PermissionEnum.UPDATE_USER,

    PermissionEnum.VIEW_LANDLORD,
    PermissionEnum.UPDATE_LANDLORD,

    PermissionEnum.UPLOAD_FILES, // they can upload their profile image, required documents, e.t.c

    PermissionEnum.VIEW_REQUIRED_DOCUMENT,
    PermissionEnum.VIEW_REQUIRED_DOCUMENTS,

  
      PermissionEnum.VIEW_BOOKING,
      PermissionEnum.VIEW_BOOKINGS,
      PermissionEnum.UPDATE_BOOKING,
      PermissionEnum.MANAGE_BOOKINGS,
    
  
      PermissionEnum.VIEW_BOOKING_CANCELLATION,
      PermissionEnum.VIEW_BOOKING_CANCELLATIONS,
      PermissionEnum.MANAGE_BOOKING_CANCELLATIONS,
    
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
    name: RolesEnum.CustomerRole,
    permissions: RolePermissions.customer,
  },
  {
    name: RolesEnum.Employee,
    permissions: RolePermissions.employee,
  },
];
