import {
  CreateProperty,
  PostCreateProperty,
  PropertyApprovalStatus,
  PropertyType,
} from '@newmbani/types';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class CreatePropertyDto implements CreateProperty {
  @IsNotEmpty()
  @IsString()
  landlordId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  rentPrice: number;

  @IsNotEmpty()
  @IsNumber()
  deposit: number;

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @IsNotEmpty()
  @IsNumber()
  availableUnits: number;

  @IsNotEmpty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @Type(() => AddressDto)
  @ValidateNested()
  address: AddressDto;
}

export class PostCreatePropertyDto
  extends CreatePropertyDto
  implements PostCreateProperty
{
  @IsOptional()
  @IsArray()
  images?: string[];

  @IsEnum(PropertyApprovalStatus)
  @IsNotEmpty()
  approvalStatus: PropertyApprovalStatus;

  @IsString()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
export class PostUpdatePropertyDto extends PartialType(PostCreatePropertyDto) {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsNotEmpty()
  updatedAt: Date;
}
