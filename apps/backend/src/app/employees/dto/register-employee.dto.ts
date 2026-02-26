import { PostNewEmployee, RegisterEmployee } from '@newmbani/types';
import { OmitType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterEmployeeDto implements RegisterEmployee {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class PostNewEmployeeDto
  extends OmitType(RegisterEmployeeDto, ['password'] as const)
  implements PostNewEmployee
{
  @IsOptional()
  @IsString()
  createdBy: string;
}
