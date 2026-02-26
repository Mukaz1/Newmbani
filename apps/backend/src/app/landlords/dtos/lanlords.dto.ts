import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LandlordApprovalStatus } from '@newmbani/types';
export class CreateLandlordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsNotEmpty()
  @IsBoolean()
  acceptTerms: boolean;

  @IsArray()
  @IsOptional()
  languages?: string[];
}

export class PostLandlordDto extends OmitType(CreateLandlordDto, ['password']) {
  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsNotEmpty()
  @IsEnum(LandlordApprovalStatus)
  approvalStatus: LandlordApprovalStatus;
}

export class LandlordDto extends PostLandlordDto {
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date | null;

  @IsDate()
  @IsOptional()
  deletedAt: Date | null;

  @IsOptional()
  @IsString()
  createdBy: string;

  @IsOptional()
  @IsString()
  updatedBy: string | null;

  @IsString()
  @IsOptional()
  deletedBy: string | null;
}

export class UpdateLandlordDto extends PartialType(PostLandlordDto) {}

export class PostUpdatedLandlordDto extends UpdateLandlordDto {
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  updatedBy: string;
}
