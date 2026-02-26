import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAuthLogDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsObject()
  @IsNotEmpty()
  originalReq: any;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  loginSuccess: boolean;


  @IsString()
  @IsOptional()
  message?: string;
}

export class PostAuthLogDto {
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

  @IsBoolean()
  @IsNotEmpty()
  loginSuccess: boolean;
}
