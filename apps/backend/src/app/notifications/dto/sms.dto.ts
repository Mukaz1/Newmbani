import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SMSDto {
  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
