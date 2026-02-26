import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class DefaultAddressDto {
  @IsNotEmpty()
  @IsString()
  defaultAddress: string;
}

export class PostDefaultAddressStatusDto extends DefaultAddressDto {
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}
