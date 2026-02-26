import { IsEmail, IsNotEmpty } from 'class-validator';

export class MagicLoginDto {
  @IsNotEmpty()
  @IsEmail()
  destination: string; // the email to send the email login link
}
