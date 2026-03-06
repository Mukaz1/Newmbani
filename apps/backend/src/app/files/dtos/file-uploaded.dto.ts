import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { UploadedFileResponse } from '@newmbani/types';

export class UploadedFileResponseDto<T = any> implements UploadedFileResponse {
  @IsNotEmpty()
  @IsObject()
  metadata: T;

  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
