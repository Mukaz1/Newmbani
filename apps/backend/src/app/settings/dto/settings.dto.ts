import { StorageSettings } from '@newmbani/types';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  boxAddress: string;

  @IsNotEmpty()
  @IsString()
  town: string;

  @IsNotEmpty()
  @IsString()
  building: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

export class EmailAuthDto {
  @IsString()
  user: string;

  @IsString()
  pass: string;
}

export class CreateSettingsDTO {
  @IsObject()
  general: {
    app: string;
    company: string;
    email: string;
    phone: string;
    KRA: string;
    address: AddressDto;
  };

  @IsObject()
  @IsOptional()
  facebookApp?: {
    FACEBOOK_APP_ID?: string;
    FACEBOOK_APP_SECRET?: string;
    FACEBOOK_RECIPIENT_WAID?: string;
    FACEBOOK_VERSION?: string;
    FACEBOOK_PHONE_NUMBER_ID?: string;
    FACEBOOK_ACCESS_TOKEN?: string;
  };

  @IsObject()
  mail: {
    port: number;
    auth: EmailAuthDto;
    host: string;
    from: string;
  };

  @IsObject()
  @IsOptional()
  branding?: {
    logo?: string;
    darkLogo?: string;
    favicon?: string;
  };

  @IsString()
  appURL: string;

  @IsObject()
  storage: StorageSettings;

  @IsOptional()
  @IsNumber()
  uniqueId?: number;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsString()
  deletedBy?: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
