import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterPermissionDto {
  @ApiProperty({
    example: 'create-user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  permission: string;
}
