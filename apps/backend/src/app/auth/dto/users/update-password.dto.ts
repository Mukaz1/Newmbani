import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}

export class UpdatePasswordWithOTPDto extends UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdatePasswordWithTokenDto extends UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  resetPasswordToken: string;
}

export class UpdatePasswordResetDto {
  @IsString()
  @IsOptional()
  userId: string;
  
  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsString()
  @IsOptional()
  otpCode?: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
