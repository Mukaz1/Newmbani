import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Address, GCSFileResponse } from '@newmbani/types';

export class UploadLogoToGCSDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  KRA: string;

  @IsNotEmpty()
  address: Address;
}

export class LogoUploadedResponseDto {
  @IsNotEmpty()
  metadata: GCSFileResponse;

  @IsNotEmpty()
  payload: UploadLogoToGCSDto;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
