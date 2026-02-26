import { IsNotEmpty, IsString } from 'class-validator';

export class ReleasesDto {
  @IsNotEmpty()
  @IsString()
  appVersion: string;
}
