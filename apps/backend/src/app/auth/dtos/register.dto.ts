import { RolesEnum } from '@newmbani/types';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password: string;

    @IsOptional()
    @IsEnum(RolesEnum, { message: 'Role must be VOTER, ADMIN, or ELECTORAL_COMMISSION' })
    role?: RolesEnum;
}
