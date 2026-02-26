import { ApiProperty } from '@nestjs/swagger';
import { CreateRole } from '@newmbani/types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto implements CreateRole {
  @ApiProperty({
    example: 'Receptionist',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['create-user', 'update-user'],
    required: false,
  })
  @IsOptional()
  permissions: string[];
}

export class PostRoleDto {
  @ApiProperty({
    example: '4587fhjhfdjh45487',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
