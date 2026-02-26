import { User } from '@newmbani/types';
import { IsNotEmpty } from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty()
  user: User;
}
