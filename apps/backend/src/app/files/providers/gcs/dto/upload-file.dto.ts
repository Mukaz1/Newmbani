import { FileTypesEnum } from '@newmbani/types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileToGCSDto {
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
}
