import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePropertyCategoryDto {
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

export class PostNewPropertyCategoryDto extends CreatePropertyCategoryDto {
  @IsString()
  @IsNotEmpty()
  createdBy: string;
  @IsString()
  @IsNotEmpty()
  slug: string;
}

// Update
export class UpdatePropertyCategoryDto extends PartialType(
  CreatePropertyCategoryDto
) {}

export class PostPropertyCategoryUpdateDto extends UpdatePropertyCategoryDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsString()
  @IsNotEmpty()
  updatedAt: Date;
}
