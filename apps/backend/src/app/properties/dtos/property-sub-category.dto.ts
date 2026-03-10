import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePropertiesSubCategoryDto {
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

export class PostNewPropertiesSubCategoryDto extends CreatePropertiesSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

// Update
export class UpdatePropertiesSubCategoryDto extends PartialType(
  CreatePropertiesSubCategoryDto
) {}

export class PostPropertiesSubCategoryUpdateDto extends UpdatePropertiesSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: Date;
}
