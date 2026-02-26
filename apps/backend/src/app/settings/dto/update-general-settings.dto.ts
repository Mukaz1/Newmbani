import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from './settings.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateGeneralSettingsDto {
  @IsOptional()
  @IsString()
  app?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  KRA?: string;

  @IsOptional()
  @ApiProperty({
    type: AddressDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address?: AddressDto;
}
