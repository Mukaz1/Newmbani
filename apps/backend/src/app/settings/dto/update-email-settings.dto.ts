import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto, EmailAuthDto } from './settings.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateEmailSettingsDto {
  @IsNumber()
  @IsOptional()
  port?: number;

  @IsString()
  @IsOptional()
  host?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsOptional()
  @ApiProperty({
    type: AddressDto,
    isArray: false,
  })
  @ValidateNested({ each: true })
  @Type(() => EmailAuthDto)
  auth?: EmailAuthDto;
}
