import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandingSettingsDto {
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  darkLogo?: string;

  @IsString()
  @IsOptional()
  favicon?: string;
}
