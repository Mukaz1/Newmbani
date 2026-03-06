import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GCSFileResponseDto {
  metadata: {
    kind?: string;
    id?: string;
    selfLink?: string;
    mediaLink?: string;
    name: string;
    bucket?: string;
    generation?: string;
    metageneration?: string;
    contentType: string;
    storageClass?: string;
    size: number;
    md5Hash?: string;
    crc32c?: string;
    etag?: string;
    timeCreated: Date;
    updated?: string;
    timeStorageClassUpdated?: string;
    originalName?: string;
    encoding?: string;
    fileName?: string;
  };
}

export class GenerateSignedURLDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsNumber()
  @IsOptional()
  expiry: string;
}
