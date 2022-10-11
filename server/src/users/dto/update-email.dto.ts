import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmailRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
