import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GCSFileResponse } from '@newmbani/types';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  signature?: GCSFileResponse;
}

export class PostEmployeeUpdateDto extends UpdateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @IsDate()
  @IsString()
  updatedDate: Date;
}
