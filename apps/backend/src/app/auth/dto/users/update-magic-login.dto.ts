import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ManageMagicLoginDto {
  @IsNotEmpty()
  @IsBoolean()
  magicLogin: boolean;
}

export class PostMagicLoginStatusDto extends ManageMagicLoginDto {
  @IsNotEmpty()
  @IsString()
  updatedBy: string;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;
}
