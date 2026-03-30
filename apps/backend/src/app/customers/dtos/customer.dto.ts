import { RegisterCustomer, UpdateCustomer } from '@newmbani/types';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { AddressDto } from '../../common/dto/address.dto';
import { Type } from 'class-transformer';

export class RegisterCustomerDto implements RegisterCustomer {
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


export class UpdateCustomerDto implements UpdateCustomer {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}


export class PostCustomerDto extends RegisterCustomerDto {
  @IsString()
  @IsOptional()
  createdBy?: string;
}
