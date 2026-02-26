import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsOptional()
  userId: string;

  @IsObject()
  @IsNotEmpty()
  originalReq: any;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class PostLogDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  ip: string;

  @IsString()
  @IsOptional()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
