import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { CreateFileInterface } from '@newmbani/types';

export class CreateFileDto implements CreateFileInterface {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsObject()
  file: object;

  @IsNotEmpty()
  @IsString()
  url: string;
}
