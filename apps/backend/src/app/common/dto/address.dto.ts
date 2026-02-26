import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddressDto {
    @IsNotEmpty()
    @IsString()
    countryId: string;

    @IsString()
    @IsNotEmpty()
    county:string;

    @IsString()
    @IsOptional()
    town?:string;

    @IsString()
    @IsOptional()
    street?: string;

    @IsString()
    @IsOptional()
    building?:string;
}