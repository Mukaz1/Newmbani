import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreatePropertyImageCategory,
  PostPropertyCategory,
  PostPropertyImageCategory,
} from '@newmbani/types';

export class CreatePropertyImageCategoryDto
  implements CreatePropertyImageCategory
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  minNumber: number;

  @IsNumber()
  @IsNotEmpty()
  maxNumber: number;

  @IsNumber()
  @IsOptional()
  maxFileSize?: number;
}

export class PostNewPropertyImageCategoryDto
  extends CreatePropertyImageCategoryDto
  implements PostPropertyImageCategory
{
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  createdAt?: Date;
}

export class UpdatePropertyImageCategoryDto extends PartialType(
  CreatePropertyImageCategoryDto
) {}

export class PostPropertyImageCategoryUpdateDto extends UpdatePropertyImageCategoryDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
