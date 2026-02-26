import { StorageConfigsServiceJson } from './gcs';
import { CloudinaryStorageConfig } from './cloudinary';
import { StorageProvidersEnum } from '../files';

export interface CompanyAddress {
  boxAddress: string;
  town: string;
  building?: string;
  street?: string;
  postalCode: string;
  country: string;
}

export interface GeneralSettings {
  app: string;
  company: string;
  email: string;
  phone: string;
  KRA: string;
  address: CompanyAddress;
}
export interface FacebookApp {
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  FACEBOOK_RECIPIENT_WAID: string;
  FACEBOOK_VERSION: string;
  FACEBOOK_PHONE_NUMBER_ID: string;
  FACEBOOK_ACCESS_TOKEN: string;
}

export interface MailSettings {
  port: number;
  auth: {
    user: string;
    pass: string;
  };
  host: string;
  from: string;
}

export interface StorageSettings {
  gcs?: {
    serviceAccount: StorageConfigsServiceJson;
    bucketName: string;
  };
  defaultStorageType: StorageProvidersEnum;
  cloudinary?: CloudinaryStorageConfig;
}

export interface Branding {
  logo: string;
  logoFile?: object;
  darkLogo: string;
  favicon: string;
}
export interface APIAuthParams {
  email: string;
  password: string;
}

export interface CurrencyConversion {
  currency: string;
  rate: number | string;
}

export interface Settings {
  _id?: string;
  general: GeneralSettings;
  balanceBroughtForwardDate?: Date;
  mail?: MailSettings;
  facebookApp?: FacebookApp;
  branding: Branding;
  appURL: string;
  currencyConversionAgainstUSD?: CurrencyConversion[];
  vatRate: number;
  storage?: StorageSettings;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedBy?: string;
  deletedAt?: Date;
}
export interface SystemSettings extends Settings {
  _id: string;
}
