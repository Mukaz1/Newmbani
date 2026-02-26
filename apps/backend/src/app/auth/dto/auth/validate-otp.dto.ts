import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateOTPDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
