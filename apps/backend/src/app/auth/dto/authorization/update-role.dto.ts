import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class ApproveRoleDto {}

export class PostApprovedRoleDto extends ApproveRoleDto {
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
