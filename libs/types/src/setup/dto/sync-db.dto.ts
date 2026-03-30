import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyncSuperAdminDto {
  @IsOptional()
  @IsString()
  appURL?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
