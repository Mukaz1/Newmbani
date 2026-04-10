import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    example: 'frasiah@newmbani.co.ke',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
