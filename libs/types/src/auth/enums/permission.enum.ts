
export enum PermissionEnum {
  // ADMINISTRATION
  SYNC_DATABASE = 'sync-database',
  MANAGE_ALL = 'manage-all',

  // USERS
  CREATE_USER = 'create-user',
  VIEW_USER = 'view-user',
  UPDATE_USER = 'update-user',
  DELETE_USER = 'delete-user',
  UPDATE_USER_PERMISSIONS = 'update-user-permissions',
  MANAGE_USERS = 'manage-users',

  // EMPLOYEES
  CREATE_EMPLOYEE = 'create-employee',
  VIEW_EMPLOYEE = 'view-employee',
  VIEW_EMPLOYEES = 'view-employees',
  UPDATE_EMPLOYEE = 'update-employee',
  DELETE_EMPLOYEE = 'delete-employee',
  UPDATE_EMPLOYEE_PERMISSIONS = 'update-employee-permissions',
  MANAGE_EMPLOYEES = 'manage-employees',

  // TENANTS
  CREATE_TENANT = 'create-tenant',
  VIEW_TENANT = 'view-tenant',
  UPDATE_TENANT = 'update-tenant',
  DELETE_TENANT = 'delete-tenant',
  MANAGE_TENANTS = 'manage-tenants',



  // SETTINGS
  VIEW_SETTINGS = 'view-settings',
  UPDATE_SETTINGS = 'update-settings',
  MANAGE_SETTINGS = 'manage-settings',

  // ROLES
  CREATE_ROLE = 'create-role',
  VIEW_ROLE = 'view-role',
  UPDATE_ROLE = 'update-role',
  DELETE_ROLE = 'delete-role',
  MANAGE_ROLE = 'manage-role',

  // LANDLORDs
  CREATE_LANDLORD = 'create-landlord',
  VIEW_LANDLORD = 'view-landlord',
  VIEW_LANDLORDS = 'view-landlords',
  UPDATE_LANDLORD = 'update-landlord',
  DELETE_LANDLORD = 'delete-landlord',
  MANAGE_LANDLORDS = 'manage-landlords',



  // Bank Accounts
  CREATE_BANK_ACCOUNT = 'create-bank-account',
  VIEW_BANK_ACCOUNT = 'view-bank-account',
  VIEW_BANK_ACCOUNTS = 'view-bank-accounts',
  UPDATE_BANK_ACCOUNT = 'update-bank-account',
  DELETE_BANK_ACCOUNT = 'delete-bank-account',
  MANAGE_BANK_ACCOUNTS = 'manage-bank-accounts',

  // Banks
  CREATE_BANK = 'create-bank',
  VIEW_BANK = 'view-bank',
  VIEW_BANKS = 'view-banks',
  UPDATE_BANK = 'update-bank',
  DELETE_BANK = 'delete-bank',
  MANAGE_BANKS = 'manage-banks',

  // CONTACTS
  CREATE_CONTACT = 'create-contact',
  VIEW_CONTACTS = 'view-contacts',
  VIEW_CONTACT = 'view-contact',
  UPDATE_CONTACT = 'update-contact',
  DELETE_CONTACT = 'delete-contact',
  MANAGE_CONTACT = 'manage-contact',

  // Company Accounts
  CREATE_COMPANY_ACCOUNT = 'create-company-account',
  VIEW_COMPANY_ACCOUNT = 'view-company-account',
  VIEW_COMPANY_ACCOUNTS = 'view-company-accounts',
  UPDATE_COMPANY_ACCOUNT = 'update-company-account',
  DELETE_COMPANY_ACCOUNT = 'delete-company-account',
  MANAGE_COMPANY_ACCOUNTS = 'manage-company-accounts',

  // Invoices
  VIEW_INVOICE = 'view-invoice',
  VIEW_INVOICES = 'view-invoices',
  DELETE_INVOICE = 'delete-invoice',
  MANAGE_INVOICES = 'manage-invoices',

  // PAYMENTS
  VIEW_PAYMENT = 'view-payment',
  VIEW_PAYMENTS = 'view-payments',
  MANAGE_PAYMENTS = 'manage-payments',

  // Tasks
  VIEW_TASK = 'view-task',
  VIEW_TASKS = 'view-tasks',
  CREATE_TASK = 'create-task',
  UPDATE_TASK = 'update-task',
  DELETE_TASK = 'delete-task',
  MANAGE_TASKS = 'manage-tasks',

  // PROPERTIES
  CREATE_PROPERTY = 'create-property',
  VIEW_PROPERTY = 'view-property',
  VIEW_PROPERTIES = 'view-properties',
  UPDATE_PROPERTY = 'update-property',
  DELETE_PROPERTY = 'delete-property',
  MANAGE_PROPERTIES = 'manage-properties',
  REVIEW_PROPERTIES = 'review-properties',

  // Property listing
  CREATE_PROPERTY_LISTING = 'create-property-listing',
  VIEW_PROPERTY_LISTING = 'view-property-listing',
  VIEW_PROPERTY_LISTINGS = 'view-property-listings',
  UPDATE_PROPERTY_LISTING = 'update-property-listing',
  DELETE_PROPERTY_LISTING = 'delete-property-listing',
  MANAGE_PROPERTY_LISTINGS = 'manage-property-listings',
  APPROVE_PROPERTY_LISTING = 'approve-property-listing',

  // COUNTRIES
  CREATE_COUNTRY = 'create-country',
  VIEW_COUNTRY = 'view-country',
  VIEW_COUNTRIES = 'view-countries',
  UPDATE_COUNTRY = 'update-country',
  DELETE_COUNTRY = 'delete-country',
  MANAGE_COUNTRIES = 'manage-countries',

  // PROPERTY CATEGORIES
  CREATE_PROPERTY_CATEGORY = 'create-property-category',
  VIEW_PROPERTY_CATEGORY = 'view-property-category',
  VIEW_PROPERTY_CATEGORIES = 'view-property-categories',
  UPDATE_PROPERTY_CATEGORY = 'update-property-category',
  DELETE_PROPERTY_CATEGORY = 'delete-property-category',
  MANAGE_PROPERTY_CATEGORIES = 'manage-property-categories',

  //AMENITY CATEGORIES
  CREATE_AMENITY_CATEGORY = 'create-amenity-category',
  VIEW_AMENITY_CATEGORY = 'view-amenity-category',
  VIEW_AMENITY_CATEGORIES = 'view-amenity-categories',
  UPDATE_AMENITY_CATEGORY = 'update-amenity-category',
  DELETE_AMENITY_CATEGORY = 'delete-amenity-category',
  MANAGE_AMENITY_CATEGORIES = 'manage-amenity-categories',

  //AMENITIES
  CREATE_AMENITY = 'create-amenity',
  VIEW_AMENITY = 'view-amenity',
  VIEW_AMENITIES = 'view-amenities',
  UPDATE_AMENITY = 'update-amenity',
  DELETE_AMENITY = 'delete-amenity',
  MANAGE_AMENITIES = 'manage-amenities',

  // Required Documents
  CREATE_REQUIRED_DOCUMENT = 'create-required-documents',
  VIEW_REQUIRED_DOCUMENTS = 'view-required-documents',
  VIEW_REQUIRED_DOCUMENT = 'view-required-document',
  UPDATE_REQUIRED_DOCUMENT = 'update-required-documents',
  DELETE_REQUIRED_DOCUMENT = 'delete-required-documents',
  MANAGE_REQUIRED_DOCUMENTS = 'manage-required-documents',
  APPROVE_REQUIRED_DOCUMENT = 'approve-required-document',

  //LANDLORD Documents
  CREATE_LANDLORD_DOCUMENT = 'create-landlord-documents',
  VIEW_LANDLORD_DOCUMENTS = 'view-landlord-documents',
  VIEW_LANDLORD_DOCUMENT = 'view-landlord-document',
  UPDATE_LANDLORD_DOCUMENT = 'update-landlord-documents',
  DELETE_LANDLORD_DOCUMENT = 'delete-landlord-documents',
  MANAGE_LANDLORD_DOCUMENTS = 'manage-landlord-documents',
  APPROVE_LANDLORD_DOCUMENT = 'approve-landlord-document',

  // Payment Allocations
  CREATE_PAYMENT_ALLOCATION = 'create-payment-allocation',
  VIEW_PAYMENT_ALLOCATION = 'view-payment-allocation',
  VIEW_PAYMENT_ALLOCATIONS = 'view-payment-allocations',
  UPDATE_PAYMENT_ALLOCATION = 'update-payment-allocation',
  DELETE_PAYMENT_ALLOCATION = 'delete-payment-allocation',
  MANAGE_PAYMENT_ALLOCATIONS = 'manage-payment-allocations',

  // BOOKINGS
  CREATE_BOOKING = 'create-booking',
  VIEW_BOOKING = 'view-booking',
  VIEW_BOOKINGS = 'view-bookings',
  UPDATE_BOOKING = 'update-booking',
  DELETE_BOOKING = 'delete-booking',
  MANAGE_BOOKINGS = 'manage-bookings',

  // Upload files
  UPLOAD_FILES = 'upload-files',

  // HELP CENTER TOPICS
  CREATE_TOPIC = 'create-topic',
  VIEW_TOPIC = 'view-topic',
  VIEW_TOPICS = 'view-topics',
  UPDATE_TOPIC = 'update-topic',
  DELETE_TOPIC = 'delete-topic',
  MANAGE_TOPICS = 'manage-topics',

  // FAQS
  CREATE_FAQ = 'create-faq',
  VIEW_FAQ = 'view-faq',
  VIEW_FAQS = 'view-faqs',
  UPDATE_FAQ = 'update-faq',
  DELETE_FAQ = 'delete-faq',
}

export const ModulePermissions = {
  // ADMINISTRATION
  admin: [PermissionEnum.SYNC_DATABASE, PermissionEnum.MANAGE_ALL],

  // USERS
  user: [
    PermissionEnum.CREATE_USER,
    PermissionEnum.VIEW_USER,
    PermissionEnum.UPDATE_USER,
    PermissionEnum.DELETE_USER,
    PermissionEnum.UPDATE_USER_PERMISSIONS,
    PermissionEnum.MANAGE_USERS,
  ],

  // EMPLOYEES
  employee: [
    PermissionEnum.CREATE_EMPLOYEE,
    PermissionEnum.VIEW_EMPLOYEE,
    PermissionEnum.VIEW_EMPLOYEES,
    PermissionEnum.UPDATE_EMPLOYEE,
    PermissionEnum.DELETE_EMPLOYEE,
    PermissionEnum.UPDATE_EMPLOYEE_PERMISSIONS,
    PermissionEnum.MANAGE_EMPLOYEES,
  ],


  // SETTINGS
  settings: [
    PermissionEnum.VIEW_SETTINGS,
    PermissionEnum.UPDATE_SETTINGS,
    PermissionEnum.MANAGE_SETTINGS,
  ],

  // ROLES
  role: [
    PermissionEnum.CREATE_ROLE,
    PermissionEnum.VIEW_ROLE,
    PermissionEnum.UPDATE_ROLE,
    PermissionEnum.DELETE_ROLE,
    PermissionEnum.MANAGE_ROLE,
  ],

  // LANDLORDS
  landlord: [
    PermissionEnum.CREATE_LANDLORD,
    PermissionEnum.VIEW_LANDLORD,
    PermissionEnum.VIEW_LANDLORDS,
    PermissionEnum.UPDATE_LANDLORD,
    PermissionEnum.DELETE_LANDLORD,
    PermissionEnum.MANAGE_LANDLORDS,
  ],



  // BANK ACCOUNTS
  bankAccount: [
    PermissionEnum.CREATE_BANK_ACCOUNT,
    PermissionEnum.VIEW_BANK_ACCOUNT,
    PermissionEnum.VIEW_BANK_ACCOUNTS,
    PermissionEnum.UPDATE_BANK_ACCOUNT,
    PermissionEnum.DELETE_BANK_ACCOUNT,
    PermissionEnum.MANAGE_BANK_ACCOUNTS,
  ],

  // BANKS
  bank: [
    PermissionEnum.CREATE_BANK,
    PermissionEnum.VIEW_BANK,
    PermissionEnum.VIEW_BANKS,
    PermissionEnum.UPDATE_BANK,
    PermissionEnum.DELETE_BANK,
    PermissionEnum.MANAGE_BANKS,
  ],

  // COMPANY ACCOUNTS
  companyAccount: [
    PermissionEnum.CREATE_COMPANY_ACCOUNT,
    PermissionEnum.VIEW_COMPANY_ACCOUNT,
    PermissionEnum.VIEW_COMPANY_ACCOUNTS,
    PermissionEnum.UPDATE_COMPANY_ACCOUNT,
    PermissionEnum.DELETE_COMPANY_ACCOUNT,
    PermissionEnum.MANAGE_COMPANY_ACCOUNTS,
  ],

  // INVOICES
  invoice: [
    PermissionEnum.VIEW_INVOICE,
    PermissionEnum.VIEW_INVOICES,
    PermissionEnum.DELETE_INVOICE,
    PermissionEnum.MANAGE_INVOICES,
  ],

  // TASKS
  task: [
    PermissionEnum.CREATE_TASK,
    PermissionEnum.VIEW_TASK,
    PermissionEnum.UPDATE_TASK,
    PermissionEnum.DELETE_TASK,
    PermissionEnum.MANAGE_TASKS,
  ],

  // PROPERTIES
  property: [
    PermissionEnum.CREATE_PROPERTY,
    PermissionEnum.VIEW_PROPERTY,
    PermissionEnum.VIEW_PROPERTIES,
    PermissionEnum.UPDATE_PROPERTY,
    PermissionEnum.DELETE_PROPERTY,
    PermissionEnum.MANAGE_PROPERTIES,
  ],

  // PROPERTY LISTINGS
  propertyListing: [
    PermissionEnum.CREATE_PROPERTY_LISTING,
    PermissionEnum.VIEW_PROPERTY_LISTING,
    PermissionEnum.VIEW_PROPERTY_LISTINGS,
    PermissionEnum.UPDATE_PROPERTY_LISTING,
    PermissionEnum.DELETE_PROPERTY_LISTING,
    PermissionEnum.MANAGE_PROPERTY_LISTINGS,
    PermissionEnum.APPROVE_PROPERTY_LISTING,
  ],

  // COUNTRIES
  country: [
    PermissionEnum.CREATE_COUNTRY,
    PermissionEnum.VIEW_COUNTRY,
    PermissionEnum.VIEW_COUNTRIES,
    PermissionEnum.UPDATE_COUNTRY,
    PermissionEnum.DELETE_COUNTRY,
    PermissionEnum.MANAGE_COUNTRIES,
  ],

  // PROPERTY CATEGORIES
  propertyCategory: [
    PermissionEnum.CREATE_PROPERTY_CATEGORY,
    PermissionEnum.VIEW_PROPERTY_CATEGORY,
    PermissionEnum.VIEW_PROPERTY_CATEGORIES,
    PermissionEnum.UPDATE_PROPERTY_CATEGORY,
    PermissionEnum.DELETE_PROPERTY_CATEGORY,
    PermissionEnum.MANAGE_PROPERTY_CATEGORIES,
  ],

  // AMENITY CATEGORIES
  amenityCategory: [
    PermissionEnum.CREATE_AMENITY_CATEGORY,
    PermissionEnum.VIEW_AMENITY_CATEGORY,
    PermissionEnum.VIEW_AMENITY_CATEGORIES,
    PermissionEnum.UPDATE_AMENITY_CATEGORY,
    PermissionEnum.DELETE_AMENITY_CATEGORY,
    PermissionEnum.MANAGE_AMENITY_CATEGORIES,
  ],

  // AMENITIES
  amenity: [
    PermissionEnum.CREATE_AMENITY,
    PermissionEnum.VIEW_AMENITY,
    PermissionEnum.VIEW_AMENITIES,
    PermissionEnum.UPDATE_AMENITY,
    PermissionEnum.DELETE_AMENITY,
    PermissionEnum.MANAGE_AMENITIES,
  ],

  // REQUIRED DOCUMENTS
  requiredDocument: [
    PermissionEnum.CREATE_REQUIRED_DOCUMENT,
    PermissionEnum.VIEW_REQUIRED_DOCUMENTS,
    PermissionEnum.VIEW_REQUIRED_DOCUMENT,
    PermissionEnum.UPDATE_REQUIRED_DOCUMENT,
    PermissionEnum.DELETE_REQUIRED_DOCUMENT,
    PermissionEnum.MANAGE_REQUIRED_DOCUMENTS,
  ],

  landlordDocument: [
    PermissionEnum.CREATE_LANDLORD_DOCUMENT,
    PermissionEnum.VIEW_LANDLORD_DOCUMENTS,
    PermissionEnum.VIEW_LANDLORD_DOCUMENT,
    PermissionEnum.UPDATE_LANDLORD_DOCUMENT,
    PermissionEnum.DELETE_LANDLORD_DOCUMENT,
    PermissionEnum.MANAGE_LANDLORD_DOCUMENTS,
  ],

  // PAYMENT ALLOCATIONS
  paymentAllocation: [
    PermissionEnum.CREATE_PAYMENT_ALLOCATION,
    PermissionEnum.VIEW_PAYMENT_ALLOCATION,
    PermissionEnum.VIEW_PAYMENT_ALLOCATIONS,
    PermissionEnum.UPDATE_PAYMENT_ALLOCATION,
    PermissionEnum.DELETE_PAYMENT_ALLOCATION,
    PermissionEnum.MANAGE_PAYMENT_ALLOCATIONS,
  ],

  // BOOKINGS
  booking: [
    PermissionEnum.CREATE_BOOKING,
    PermissionEnum.VIEW_BOOKING,
    PermissionEnum.VIEW_BOOKINGS,
    PermissionEnum.UPDATE_BOOKING,
    PermissionEnum.DELETE_BOOKING,
    PermissionEnum.MANAGE_BOOKINGS,
  ],

  files: [PermissionEnum.UPLOAD_FILES],
  contacts: [
    PermissionEnum.CREATE_CONTACT,
    PermissionEnum.VIEW_CONTACTS,
    PermissionEnum.VIEW_CONTACT,
    PermissionEnum.UPDATE_CONTACT,
    PermissionEnum.MANAGE_CONTACT,
  ],

  topics: [
    PermissionEnum.CREATE_TOPIC,
    PermissionEnum.VIEW_TOPIC,
    PermissionEnum.VIEW_TOPICS,
    PermissionEnum.UPDATE_TOPIC,
    PermissionEnum.DELETE_TOPIC,
    PermissionEnum.MANAGE_TOPICS,
  ],

  faqs: [
    PermissionEnum.CREATE_FAQ,
    PermissionEnum.VIEW_FAQ,
    PermissionEnum.VIEW_FAQS,
    PermissionEnum.UPDATE_FAQ,
    PermissionEnum.DELETE_FAQ,
  ],
  payments: [
    PermissionEnum.VIEW_PAYMENT,
    PermissionEnum.VIEW_PAYMENTS,
    PermissionEnum.MANAGE_PAYMENTS,
  ],
};
