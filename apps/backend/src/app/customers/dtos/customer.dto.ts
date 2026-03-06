import { CreateCustomer } from '@newmbani/types';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';
import { Type } from 'class-transformer';

export class CreateCustomerDto implements CreateCustomer {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsBoolean()
  @IsNotEmpty()
  acceptTerms: boolean;
}

export class PostCustomerDto extends CreateCustomerDto {
  @IsString()
  @IsOptional()
  createdBy?: string;
}

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
