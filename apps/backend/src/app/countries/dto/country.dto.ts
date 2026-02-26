import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCountry } from '@newmbani/types';

// Commission Rate DTOs
export class CommissionRateDto {
  @IsNumber()
  @Min(0)
  rate: number;

  @IsOptional()
  @IsString()
  currencyId?: string;

  @IsBoolean()
  isPercentage: boolean;
}

export class CommissionRatesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CommissionRateDto)
  service?: CommissionRateDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CommissionRateDto)
  property?: CommissionRateDto;
}

export class SupportingDto {
  @IsOptional()
  @IsBoolean()
  landlord?: boolean;

  @IsOptional()
  @IsBoolean()
  tenant?: boolean;
}

// Create DTO - all fields required
export class CreateCountryDto
  implements Omit<CreateCountry, 'commissionRates' | 'supporting'>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsNotEmpty()
  supported: boolean;

  @IsString()
  @IsNotEmpty()
  mobileCode: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate: number;

  @ValidateNested()
  @Type(() => CommissionRatesDto)
  commissionRates: CommissionRatesDto;

  @ValidateNested()
  @Type(() => SupportingDto)
  supporting: SupportingDto;
}

// Update DTO - all fields optional except for nested validation
export class UpdateCountryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsOptional()
  @IsBoolean()
  supported?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mobileCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CommissionRatesDto)
  commissionRates?: CommissionRatesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SupportingDto)
  supporting?: SupportingDto;
}

// Post DTO - extends Update DTO with audit fields
export class PostCountryDto extends UpdateCountryDto {
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  updatedAt?: Date;
}
