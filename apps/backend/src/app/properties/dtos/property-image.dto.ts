import {
  CreatePropertyImage,
  PostPropertyImage,
  PropertyImageApprovalStatus,
  PropertyImageReviewInterface,
  UpdatePropertyImage,
} from '@newmbani/types';
import { PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePropertyImageDto implements CreatePropertyImage {
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  propertyImageCategoryId: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class PostPropertyImageDto
  extends CreatePropertyImageDto
  implements PostPropertyImage
{
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsOptional()
  fileId?: string;

  @IsString()
  @IsOptional()
  link?: string;
}

export class PropertyImageReviewDto implements PropertyImageReviewInterface {
  @IsString()
  @IsOptional()
  comment?: string;

  @IsNotEmpty()
  @IsEnum(PropertyImageApprovalStatus)
  status: PropertyImageApprovalStatus;
}

export class UpdatePropertyImageDto {
  @IsString()
  @IsOptional()
  propertyImageCategoryId: string;
}

export class PostUpdatePropertyImageDto
  extends UpdatePropertyImageDto
  implements UpdatePropertyImage
{
  @IsDate()
  updatedAt: Date;

  @IsString()
  updatedBy: string;
}
