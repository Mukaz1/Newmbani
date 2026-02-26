import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  phoneVerified: boolean;

  @IsNotEmpty()
  isBackOfficeUser: boolean;

  @IsOptional()
  @IsString()
  otpId: string | null;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date | null;

  @IsDate()
  @IsOptional()
  deletedAt: Date | null;

  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy: string | null;

  @IsString()
  @IsOptional()
  deletedBy: string | null;
}
