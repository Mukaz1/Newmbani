import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FileTypesEnum, UploadFile } from '@newmbani/types';

export class UploadFileDto implements UploadFile {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsEnum(FileTypesEnum)
  @IsNotEmpty()
  type: FileTypesEnum;

  @IsOptional()
  documentsUploaded?: boolean;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  propertyImageCategoryId?: string;
}
