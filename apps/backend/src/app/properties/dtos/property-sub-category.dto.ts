import { PartialType } from '@nestjs/swagger';
import { CreatePropertySubCategory } from '@newmbani/types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePropertySubCategoryDto implements CreatePropertySubCategory {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class PostNewPropertySubCategoryDto extends CreatePropertySubCategoryDto {
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

// Update
export class UpdatePropertySubCategoryDto extends PartialType(
  CreatePropertySubCategoryDto
) {}

export class PostPropertySubCategoryUpdateDto extends UpdatePropertySubCategoryDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: Date;
}
