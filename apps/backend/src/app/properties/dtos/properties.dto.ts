import {
  Coordinates,
  CreateProperty,
  PostCreateProperty,
  PropertyApprovalStatus,
  PropertyFeatures,
  PropertyImage,
  Caretaker,
} from '@newmbani/types';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

// Caretaker DTO
export class CaretakerDto implements Caretaker {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class CreatePropertyDto implements CreateProperty {
  @IsNotEmpty()
  @IsString()
  landlordId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  subcategoryId: string;

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

  @Type(() => AddressDto)
  @ValidateNested()
  address: AddressDto;

  @IsObject()
  @IsNotEmpty()
  features: PropertyFeatures;

  @IsObject()
  @IsNotEmpty()
  map: Coordinates;

  @IsOptional()
  @ValidateNested()
  @Type(() => CaretakerDto)
  caretaker?: CaretakerDto;
}

export class PostCreatePropertyDto
  extends CreatePropertyDto
  implements PostCreateProperty
{
  @IsOptional()
  @IsArray()
  images?: PropertyImage[];

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

export class PropertyReviewDto {
  @IsNotEmpty()
  @IsEnum(PropertyApprovalStatus)
  status: PropertyApprovalStatus;

  @IsString()
  @IsOptional()
  reviewComment?: string;
}
