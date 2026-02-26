import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'bkiprono@bdcomputinglimited.co.ke',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ExtendedReqDto {
  @IsObject()
  @IsNotEmpty()
  originalReq: object;

  @IsObject()
  @IsNotEmpty()
  payload: object;
}
